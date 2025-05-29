const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");

router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:userId", placesControllers.getPlacesByUserId);

router.post(
  "/",
  check("title").notEmpty(),
  check("description").isLength({ min: 5 }),
  check("address").notEmpty(),
  check("imageUrl").notEmpty(),
  placesControllers.createPlace
);

router.patch(
  "/:placeId",
  check("title").notEmpty(),
  check("description").isLength({ min: 5 }),
  check("address").notEmpty(),
  check("imageUrl").notEmpty(),
  placesControllers.updatePlace
);

router.delete("/:placeId", placesControllers.deletePlace);

module.exports = router;
