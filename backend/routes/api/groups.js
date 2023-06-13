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


  module.exports = router;
