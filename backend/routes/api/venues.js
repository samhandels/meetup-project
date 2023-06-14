const express = require("express");
var validator = require("validator");

const { Group, Membership, Venue } = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");
const router = express.Router();

//edit a venue specified by its ID
router.put("/:venueId", requireAuth, async (req, res) => {
    const venue = await Venue.findOne({
      where: { id: req.params.venueId },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });

    if (!venue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const group = await Group.findOne({
      where: { id: venue.groupId },
    });

    const membership = await Membership.findOne({
      where: { groupId: venue.groupId, userId: req.user.id },
    });

    const isNotAuthorized = group.organizerId !== req.user.id && (!membership || membership.status !== "co-host");
    if (isNotAuthorized) {
      return res.status(401).json({ message: "Forbidden" });
    }

    const { address, city, state, lat, lng } = req.body;
    const errors = {};

    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!validator.isLatLong(`${lat},${lng}`)) {
      errors.lat = "Latitude is not valid";
      errors.lng = "Longitude is not valid";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    venue.address = address;
    venue.city = city;
    venue.state = state;
    venue.lat = lat;
    venue.lng = lng;

    await venue.save();

    const venueObject = {
      id: venue.id,
      groupId: venue.groupId,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng,
    };

    return res.json(venueObject);
  });


module.exports = router;
