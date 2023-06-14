const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { Group, Membership, User, GroupImage, Venue, Attendance, EventImage, Event } = require('../../db/models');
const { handleValidationErrors, getVenue } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');


//get all groups
router.get('/', async (req, res) => {
    let groups = await Group.findAll()

    // Calculates aggregate data
    for (const group of groups) {
        let members = await group.countUsers();
        group.dataValues.numMembers = members;
        let groupImage = await group.getGroupImages({
            where: { preview: true },
            attributes: ['url']
        })
        if (groupImage[0]) {
            group.dataValues.previewImage = groupImage[0].dataValues.url
        } else {
            group.dataValues.previewImage = null
        }
    }

    return res.status(200).json({
        Groups: groups
    })
})


//get all groups by current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const groupsUserOrganizes = await Group.findAll({
        where: {
            organizerId: userId
        }
    })

    const groupsUserIsMemberOf = await Group.findAll({
        include: {
            model: Membership,
            where: {
                userId: userId
            },
            attributes: []
        }
    })

    const groups = [...groupsUserOrganizes, ...groupsUserIsMemberOf]

    // Calculates aggregate data
    for (const group of groups) {
        let members = await group.countUsers();
        group.dataValues.numMembers = members;
        let groupImage = await group.getGroupImages({
            where: { preview: true },
            attributes: ['url']
        })
        if (groupImage[0]) {
            group.dataValues.previewImage = groupImage[0].dataValues.url
        } else {
            group.dataValues.previewImage = null
        }
    }

    return res.status(200).json({Groups: groups})
})


// Get details of a group from an id
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupImage,
                attributes: {
                    exclude: ['groupId', 'createdAt', 'updatedAt']
                }
            },
            {
                model: User,
                as: "Organizer",
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Venue
            }
        ]
    })
    // Checks if the group exists
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    // Calculates aggregate data
    const members = await group.countUsers();
    group.dataValues.numMembers = members;

    return res.status(200).json(group)
})


//create a group
const validateCreateGroup = (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const errors = [];

    if (!name) {
      errors.push({
        field: 'name',
        message: 'Name is required',
      });
    } else if (name.length > 60 || name.length < 5) {
      errors.push({
        field: 'name',
        message: 'Name must be 60 characters or less',
      });
    }

    if (!about) {
      errors.push({
        field: 'about',
        message: 'About is required',
      });
    } else if (about.length < 50) {
      errors.push({
        field: 'about',
        message: 'About must be 50 characters or more',
      });
    }

    if (!type) {
      errors.push({
        field: 'type',
        message: 'Type is required',
      });
    } else if (!['In person', 'Online'].includes(type)) {
      errors.push({
        field: 'type',
        message: "Type must be 'Online' or 'In person'",
      });
    }

    if (!private) {
      errors.push({
        field: 'private',
        message: 'Private must be a boolean',
      });
    }

    if (!city) {
      errors.push({
        field: 'city',
        message: 'City is required',
      });
    }

    if (!state) {
      errors.push({
        field: 'state',
        message: 'State is required',
      });
    } else if (state.length !== 2 || !state.match(/^[A-Z]+$/)) {
      errors.push({
        field: 'state',
        message: 'State must be 2 characters and all caps',
      });
    }

    if (errors.length) {
      res.status(400).json({ errors });
      return;
    }

    // Continue with the rest of the request
    next();
  };

router.post('/', validateCreateGroup, async (req, res) => {
    const { organizerId, name, about, type, private, city, state } = req.body;
    const userId = req.user.id;
    const user = await User.findByPk(userId)

    // Creates the group
    const group = await user.createGroup({
        organizerId, name, about, type, private, city, state
    })

    // Create the Membership
    await Membership.create({
        userId: userId,
        groupId: group.id,
        status: 'host'
    })

    return res.status(201).json(group)
})


//add an image to a group based on id

router.post("/:groupId/images", requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { id: userId } = req.user;
    const { url, preview } = req.body;

    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        const error = new Error("Group couldn't be found");
        error.status = 404;
        throw error;
      }

      const isNotAuthorized = group.organizerId !== userId;
      if (isNotAuthorized) {
        const error = new Error("Forbidden");
        error.status = 403;
        throw error;
      }

      const newGroupImage = await GroupImage.create({ groupId, url, preview });
      await group.addGroupImage(newGroupImage);

      const createdImage = await GroupImage.findByPk(newGroupImage.id, {
        attributes: ["id", "url", "preview"],
      });

      return res.json(createdImage);
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  });


  //edit a group based on ID
router.put("/:groupId",requireAuth, handleValidationErrors, async (req, res) => {

    const groupId = req.params.groupId;
    const groupData = {
      name: req.body.name,
      about: req.body.about,
      type: req.body.type,
      private: req.body.private,
      city: req.body.city,
      state: req.body.state,
    };

    const validationErrors = {};

    if (!groupData.name || groupData.name.length > 60) {
      validationErrors.name = "Name must be 60 characters or less";
    }

    if (!groupData.about || groupData.about.length < 50) {
      validationErrors.about = "About must be 50 characters or more";
    }

    if (!groupData.type || !["Online", "In person"].includes(groupData.type)) {
      validationErrors.type = "Type must be 'Online' or 'In person'";
    }

    if (!groupData.private || typeof groupData.private !== "boolean") {
      validationErrors.private = "Private must be a boolean";
    }

    if (!groupData.city) {
      validationErrors.city = "City is required";
    }

    if (!groupData.state) {
      validationErrors.state = "State is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      res.status(400).json({
        message: "Bad Request",
        errors: validationErrors,
      });
      return;
    }

    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        res.status(404).json({ message: "Group couldn't be found" });
        return;
      }

      if (group.organizerId !== req.user.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      await group.update(groupData);

      res.status(200).json({
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


//delete a group
router.delete("/:groupId", requireAuth, async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findOne({ where: { id: groupId } });

    //check group exists
    if (!group) {
      res.status(404).json({ message: "Group couldn't be found" });
    }

    const membership = await Membership.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
      },
    });

    if (group.organizerId != req.user.id) {
      if (!membership || membership.status !== "co-host") {
        return res.status(401).json({ message: "Forbidden" });
      }
    }

    await group.destroy();

    res.json({
      message: "Successfully deleted",
    });
  });


  //get all venues for a group by ID
router.get("/:groupId/venues", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId, {
      include: {
        model: Venue,
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    const isOrganizer = group.organizerId === req.user.id;
    const isMember = await Membership.findOne({
      where: {
        groupId,
        userId: req.user.id,
        status: "co-host",
      },
    });

    if (!isOrganizer && !isMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const venues = group.Venues;

    if (venues.length === 0) {
      return res.status(404).json({ message: "No venues found for the group" });
    }

    res.json({ Venues: venues });
  });


  //create a new venue for a group specified by its ID
router.post("/:groupId/venues", requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findByPk(groupId);
    const isNotAuthorized = group?.organizerId !== userId && !(await Membership.findOne({ where: { userId, status: "co-host", groupId } }));

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (isNotAuthorized) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const errors = {};

    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!lat) errors.lat = "Latitude is not valid";
    if (!lng) errors.lng = "Longitude is not valid";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    const venue = await Venue.create({ groupId, address, city, state, lat, lng });

    return res.status(200).json({
      id: venue.id,
      groupId: venue.groupId,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng,
    });
  });


  //get all events of a group by ID
router.get("/:groupId/events", async (req, res, next) => {
    const { groupId } = req.params;

    try {
      const events = await Event.findAll({
        where: {
          groupId: parseInt(groupId),
        },
        attributes: {
          exclude: ["description", "price", "capacity", "createdAt", "updatedAt"],
        },
        include: [
          { model: Group, attributes: ["id", "name", "city", "state"] },
          { model: Venue, attributes: ["id", "city", "state"] },
          { model: EventImage },
        ],
      });

      if (events.length === 0) {
        const group = await Group.findByPk(groupId);
        if (!group) {
          error = new Error("Group couldn't be found.");
          error.status = 404;
          error.title = "Resource couldn't be found.";
          return next(error);
        }
      }

      const eventsArr = [];
      for (const event of events) {
        const eventPojo = event.toJSON();
        const numAttending = await Attendance.count({
          where: {
            eventId: event.id,
          },
        });

        eventPojo.numAttending = numAttending;
        eventPojo.previewImage = null;

        for (const image of eventPojo.EventImages) {
          if (image.preview === true) {
            eventPojo.previewImage = image.url;
            break;
          }
        }

        delete eventPojo.EventImages;

        eventsArr.push(eventPojo);
      }

      res.json({ Events: eventsArr });
    } catch (err) {
      const error = new Error("Group couldn't be found.");
      error.status = 404;
      error.title = "Resource couldn't be found.";
      return next(error);
    }
  });

//create an event for a group by ID

router.post("/:groupId/events", requireAuth, handleValidationErrors, async (req, res, next) => {
    const { groupId } = req.params;
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    const isOrganizer = group.organizerId === req.user.id;
    const isCoHost = await Membership.findOne({
      where: {
        groupId,
        userId: req.user.id,
        status: "co-host",
      },
    });

    if (!isOrganizer && !isCoHost) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const errors = {};

    if (!name || name.length < 5) {
      errors.name = "Name must be at least 5 characters";
    }

    if (!["Online", "In person"].includes(type)) {
      errors.type = "Type must be Online or In person";
    }

    if (!Number.isInteger(capacity)) {
      errors.capacity = "Capacity must be an integer";
    }

    if (typeof price !== "number" || isNaN(price)) {
      errors.price = "Price is invalid";
    }

    if (!description) {
      errors.description = "Description is required";
    }

    const currentDate = new Date();
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedStartDate <= currentDate) {
      errors.startDate = "Start date must be in the future";
    }

    if (parsedEndDate <= parsedStartDate) {
      errors.endDate = "End date is less than start date";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    const event = await Event.create({
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    await group.addEvent(event);

    const response = {
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    };

    res.status(201).json(response);
  });


  //membership
  //get all members of a group by ID
router.get("/:groupId/members", async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findOne({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      res.status(404).json({
        message: "Group couldn't be found",
      });
      return;
    }

    const membership = req.user
      ? await Membership.findOne({
          where: {
            groupId,
            userId: req.user.id,
          },
        })
      : null;

    const membershipStatus = ["co-host", "member"];
    const isOrganizerOrCoHost =
      req.user &&
      (group.organizerId === req.user.id ||
        (membership && membership.status === "co-host"));

    const whereClause = {
      groupId,
      ...(isOrganizerOrCoHost ? {} : { status: { [Op.in]: membershipStatus } }),
    };

    const myMembers = await Membership.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: whereClause,
    });

    const members = [];

    for (const member of myMembers) {
      const user = await User.findOne({
        where: {
          id: member.userId,
        },
        attributes: ["id", "firstName", "lastName"],
      });

      const memberData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      memberData.Membership = {
        status: member.status,
      };
      members.push(memberData);
    }

    res.status(200).json({ members });
  });


  //request a membership for a group based on group ID



  module.exports = router;
