const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, Membership, User, GroupImage, Venue, Attendance } = require('../../db/models');
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
const validateCreateGroup = [
    check('name').exists({checkFalsy: true}).isLength({max: 60, min: 5}).withMessage('Name must be 60 characters or less'),
    check('about').exists({checkFalsy: true}).isLength({min: 50}).withMessage('About must be 50 characters or more'),
    check('type').exists({checkFalsy: true}).isIn(['In person', 'Online']).withMessage("Type must be 'Online' or 'In person'"),
    check('private').exists().isBoolean().withMessage('Private must be a boolean'),
    check('city').exists({checkFalsy: true}).withMessage('City is required'),
    check('state').exists({checkFalsy: true}).isAlpha().isLength({min: 2, max: 2}).withMessage('State is required'),
    handleValidationErrors
]

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
  

  module.exports = router;
