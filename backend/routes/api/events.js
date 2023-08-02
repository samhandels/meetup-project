const express = require('express');
const router = express.Router();
const { Event, Group, Venue, EventImage, User, Attendance, GroupImage, Membership } = require('../../db/models');
const { requireAuth } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation.js");
const groupimage = require('../../db/models/groupimage');

//get all events
router.get("/", async (req, res) => {
    try {
      const { name, type, startDate, page = 1, size = 20 } = req.query;

      if (page < 1) {
        return res.status(400).json({ page: "Page must be greater than or equal to 1" });
      }

      if (size < 1) {
        return res.status(400).json({ size: "Size must be greater than or equal to 1" });
      }

      const whereClause = {};
      if (name) {
        whereClause.name = name;
      }
      if (type) {
        whereClause.type = type;
      }
      if (startDate) {
        whereClause.startDate = startDate;
      }

      const events = await Event.findAndCountAll({
        where: whereClause,
        attributes: {
          exclude: ["description", "price", "capacity", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: Group,
            attributes: ["id", "name", "city", "state"],
          },
          {
            model: Venue,
            attributes: ["id", "city", "state"],
          },
          {
            model: EventImage,
            attributes: ["id", "url", "preview"],
          },
        ],
        limit: size,
        offset: (page - 1) * size,
      });

      const eventsArr = [];
      for (const event of events.rows) {
        const eventPojo = {
          id: event.id,
          groupId: event.groupId,
          venueId: event.venueId,
          name: event.name,
          type: event.type,
          startDate: event.startDate,
          endDate: event.endDate,
          numAttending: 0,
          previewImage: null,
          Group: event.Group
            ? {
                id: event.Group.id,
                name: event.Group.name,
                city: event.Group.city,
                state: event.Group.state,
              }
            : null,
          Venue: event.Venue
            ? {
                id: event.Venue.id,
                city: event.Venue.city,
                state: event.Venue.state,
              }
            : null,
        };

        const numAttending = await Attendance.count({
          where: {
            eventId: event.id,
            status: ["attending", "waitlist"],
          },
        });

        eventPojo.numAttending = numAttending;

        if (Array.isArray(event.EventImages)) {
          for (const image of event.EventImages) {
            if (image.preview === true) {
              eventPojo.previewImage = image.url;
              break;
            }
          }
        }

        delete eventPojo.EventImages;

        eventsArr.push(eventPojo);
      }

      const totalPages = Math.ceil(events.count / size);

      const response = {
        Events: eventsArr,
        pagination: {
          page: parseInt(page),
          size: parseInt(size),
          totalPages: totalPages,
        },
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while retrieving events." });
    }
  });



  // get details of an event by ID
//   router.get("/:eventId", async (req, res, next) => {
//     const { eventId } = req.params;

//   const event = await Event.findByPk(eventId, {
//     include: [
//       {
//         model: Group,
//         attributes: ["id", "name", "private", "city", "state"],
//         include: [{
//           model: GroupImage,
//           attributes:["url"]
//         },{
//           model: User,
//           attributes: ["firstName", "lastName", "id"],
//           as: "Organizer",
//         }]
//       },
//       {
//         model: EventImage,
//         attributes: ["id", "url", "preview"],
//       },
//       {
//         model: Group,
//         attributes: ["id", "name", "private", "city", "state"],
//       },
//       {
//         model: Venue,
//         attributes: ["id", "address", "city", "state", "lat", "lng"],
//       },
//     ],
//   });

//   if (!event) {
//     res.status(404).json({
//       message: "Event couldn't be found.",
//     });
//     return;
//   }

//   const numAttending = await Attendance.count({
//     where: { eventId, status: ["waitlist", "attending"] },
//   });

//   const eventPojo = {
//     id: event.id,
//     groupId: event.groupId,
//     venueId: event.venueId,
//     name: event.name,
//     description: event.description,
//     type: event.type,
//     capacity: event.capacity,
//     price: event.price,
//     startDate: event.startDate,
//     endDate: event.endDate,
//     numAttending,
//     Group: event.Group ? {
//       id: event.Group.id,
//       name: event.Group.name,
//       private: event.Group.private,
//       city: event.Group.city,
//       state: event.Group.state,
//     } : null,
//     Venue: event.Venue ? {
//       id: event.Venue.id,
//       address: event.Venue.address,
//       city: event.Venue.city,
//       state: event.Venue.state,
//       lat: event.Venue.lat,
//       lng: event.Venue.lng,
//     } : null,
//     EventImages: event.EventImages,
//   };

//   res.json(eventPojo);
// });

  // get details of an event by ID


  //   {
  //   model: GroupImage,
  //   attributes:["url"],
  //   as: "GroupImages"
  // }
router.get("/:eventId", async (req, res, next) => {
  const { eventId } = req.params;

const event = await Event.findByPk(eventId, {
  include: [
    {
      model: Group,
      attributes: ["id", "name", "private", "city", "state"],
      include: [
      {
        model: User,
        attributes: ["firstName", "lastName", "id"],
        as: "Organizer",
      }]
    },
    {
      model: Venue,
      attributes: {
        exclude: ["groupId", "updatedAt", "createdAt"],
      },
    },
    {
      model: EventImage,
      as: "EventImages",
      attributes: {
        exclude: ["eventId", "updatedAt", "createdAt"],
      },
    },
  ],
});

const group1 = await event.getGroup(
  {
    include: {model: GroupImage,
  attributes: ["url"]}
    }
)
// console.log("Group1 ---------------", group1.toJSON())


if (!event) {
  res.status(404).json({
    message: "Event couldn't be found.",
  });
  return;
}

const numAttending = await Attendance.count({
  where: { eventId, status: ["waitlist", "attending"] },
});

const eventPojo = {
  id: event.id,
  groupId: event.groupId,
  venueId: event.venueId,
  name: event.name,
  description: event.description,
  type: event.type,
  capacity: event.capacity,
  price: event.price,
  startDate: event.startDate,
  endDate: event.endDate,
  numAttending,
  Group: event.Group
    ? {
        id: event.Group.id,
        name: event.Group.name,
        private: event.Group.private,
        city: event.Group.city,
        state: event.Group.state,
        Organizer: {
          id: event.Group.Organizer.id,
          firstName: event.Group.Organizer.firstName,
          lastName: event.Group.Organizer.lastName,
        },
      }
    : null,
  Venue: event.Venue
    ? {
        id: event.Venue.id,
        address: event.Venue.address,
        city: event.Venue.city,
        state: event.Venue.state,
        lat: event.Venue.lat,
        lng: event.Venue.lng,
      }
    : null,
  EventImages: event.EventImages,
};
const groupImage = group1.toJSON()
eventPojo.groupImgURL = groupImage.GroupImages[0].url


res.json(eventPojo);
});


//add an image to an event based on eventID
router.post("/:eventId/images", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const { url, preview } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const image = await EventImage.create({
      eventId,
      url,
      preview,
    });

    const response = {
      id: image.id,
      url: image.url,
      preview: image.preview,
    };

    res.status(201).json(response);
  });


  //edit an event by ID
  router.put("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;
  const event = await Event.findOne({
    where: {
      id: eventId,
    },
    attributes: {
      exclude: ["updatedAt", "createdAt"],
    },
  });

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }

  const group = await Group.findOne({
    where: {
      id: event.groupId,
    },
  });

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const membership = await Membership.findOne({
    groupId: event.groupId,
    userId: req.user.id,
  });

  if (
    (group.organizerId !== req.user.id && !membership) ||
    (group.organizerId !== req.user.id && membership.status !== "co-host")
  ) {
    return res.status(401).json({ message: "Forbidden" });
  }

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

  const errors = [];

  if (venueId) {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      errors.push("Venue does not exist");
    }
  }

  if (!name || name.length < 5) {
    errors.push("Name must be at least 5 characters");
  }

  if (type && !["Online", "In person"].includes(type)) {
    errors.push("Type must be Online or In person");
  }

  if (!price || typeof price !== "number") {
    errors.push("Price is invalid");
  }

  if (!capacity || typeof capacity !== "number") {
    errors.push("Capacity must be an integer");
  }

  if (startDate && new Date() > new Date(startDate)) {
    errors.push("Start date must be in the future");
  }

  if (!description) {
    errors.push("Description is required");
  }

  if (endDate && startDate && endDate < startDate) {
    errors.push("End date is less than start date");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  if ( venueId || name || type || capacity || price || description || startDate || endDate) {
    event.set({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });
  }

  await event.save();
  res.json(event);
});

  //delete an event specified by ID
  router.delete("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findOne({
      where: {
        id: eventId,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    if (!event) {
      res.status(404).json({
        message: "Event couldn't be found",
      });
      return;
    }

    const group = await Group.findOne({
      where: {
        id: event.groupId,
      },
    });

    if (!group) {
      res.status(404).json({
        message: "Group couldn't be found",
      });
      return;
    }

    const membership = await Membership.findOne({
      where: {
        groupId: event.groupId,
        userId: req.user.id,
      },
    });

    if (
      group.organizerId !== req.user.id && (!membership || membership.status !== "co-host")
    ) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    await event.destroy();

    res.json({
      message: "Successfully deleted",
    });
  });



  //membership things
//get all attendees of an event by ID
router.get("/:eventId/attendees", async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findOne({ where: { id: eventId } });

    if (!event) {
      res.status(404).json({ message: "Event couldn't be found" });
      return;
    }

    const group = await Group.findByPk(event.groupId);
    const membership = await Membership.findOne({
      where: {
        groupId: group.id,
        userId: req.user.id,
        status: "co-host",
      },
    });

    const allAttend = await Attendance.findAll({
      where: {
        eventId: eventId,
      },
    });

    const attendees = [];

    for (const person of allAttend) {
      const user = await User.findOne({
        where: {
          id: person.userId,
        },
        attributes: ["id", "firstName", "lastName"],
      });

      const userJSON = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      userJSON.Attendance = {
        status: person.status,
      };

      if (group.organizerId === req.user.id || membership) {
        attendees.push(userJSON);
      } else if (person.status !== "pending") {
        attendees.push(userJSON);
      }
    }

    res.json({ attendees });
  });


//request to attend an event based on eventID
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findOne({ where: { id: eventId } });

    if (!event) {
      res.status(404).json({ message: "Event couldn't be found" });
      return;
    }

    const membership = await Membership.findOne({
      where: {
        groupId: event.groupId,
        userId: req.user.id,
      },
    });

    if (!membership) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const alreadyAttending = await Attendance.findOne({
      where: {
        userId: req.user.id,
        eventId: eventId,
      },
    });

    if (alreadyAttending) {
      const status = alreadyAttending.status;
      if (status === "pending") {
        res.status(400).json({ message: "Attendance has already been requested" });
      } else {
        res.status(400).json({ message: "User is already an attendee of the event" });
      }
      return;
    }

    const newAttend = await Attendance.create({
      userId: req.user.id,
      eventId: eventId,
      status: "pending",
    });

    res.json({ userId: newAttend.userId, status: newAttend.status });
  });



// change status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const event = await findEventById(eventId);

      if (!event) {
        return sendErrorResponse(res, 404, "Event couldn't be found");
      }

      const groupId = event.groupId;
      const userId = req.user.id;
      const { userId: editedUserId, status } = req.body;

      const group = await findGroupById(groupId);
      const membership = await findMembership(userId, groupId, 'co-host');
      const attendance = await findAttendanceByUserIdAndEventId(editedUserId, event.id);

      if (!isAuthorized(group, membership, userId)) {
        return sendErrorResponse(res, 403, 'Forbidden');
      }

      if (status === 'pending') {
        return sendErrorResponse(res, 400, 'Cannot change an attendance status to pending');
      }

      if (!attendance) {
        return sendErrorResponse(
          res,
          404,
          'Attendance between the user and the event does not exist'
        );
      }

      attendance.status = status;
      await attendance.save();

      await attendance.reload({
        attributes: {
          include: ['id'],
        },
      });

      res.json({
        id: attendance.id,
        eventId: attendance.eventId,
        userId: attendance.userId,
        status: attendance.status,
      });
    } catch (error) {
      return sendErrorResponse(res, 500, 'An error occurred while processing the request');
    }
  });

  async function findEventById(id) {
    return Event.findByPk(id);
  }

  async function findGroupById(id) {
    return Group.findByPk(id);
  }

  async function findMembership(userId, groupId, status) {
    return Membership.findOne({
      where: {
        userId,
        groupId,
        status,
      },
    });
  }

  async function findAttendanceByUserIdAndEventId(userId, eventId) {
    return Attendance.findOne({
      where: {
        userId,
        eventId,
      },
    });
  }

  function isAuthorized(group, membership, userId) {
    return group.organizerId === userId || membership !== null;
  }

  function sendErrorResponse(res, statusCode, message) {
    return res.status(statusCode).json({ message });
  }


//delete attendance to an event by ID
router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
    try {
      const event = await findEventById(req.params.eventId);

      if (!event) {
        return sendErrorResponse(res, 404, "Event couldn't be found");
      }

      const group = await findGroupById(event.groupId);

      const { userId } = req.body;

      const attendance = await findAttendanceByUserIdAndEventId(userId, event.id);

      if (!attendance) {
        return sendErrorResponse(res, 404, "Attendance does not exist for this User");
      }

      if (!isAuthorizedToDelete(group, userId, req.user.id)) {
        return sendErrorResponse(
          res,
          403,
          "Only the User or organizer may delete an Attendance"
        );
      }

      await attendance.destroy();
      res.json({
        message: "Successfully deleted attendance from event",
      });
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "An error occurred while processing the request"
      );
    }
  });

  async function findEventById(id) {
    return Event.findByPk(id);
  }

  async function findGroupById(id) {
    return Group.findByPk(id);
  }

  async function findAttendanceByUserIdAndEventId(userId, eventId) {
    return Attendance.findOne({
      where: {
        userId,
        eventId,
      },
    });
  }

  function isAuthorizedToDelete(group, userId, organizerId) {
    return group.organizerId === organizerId || userId === organizerId;
  }

  function sendErrorResponse(res, statusCode, message) {
    return res.status(statusCode).json({ message });
  }

module.exports = router;
