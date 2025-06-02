const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { getCoordinates } = require("./location");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require("fs");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not find place by id", 500));
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError("Could not find places created by that user", 500)
    );
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address } = req.body;

  let location;
  try {
    location = await getCoordinates(address);
  } catch (error) {
    return next(
      new HttpError("Could not fetch location for the specified address.", 500)
    );
  }

  const createdPlace = new Place({
    title,
    description,
    image: req.file.path,
    address,
    location,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError("creating place failed", 500));
  }

  if (!user) {
    return next(new HttpError("could not find user for provided id", 500));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const placeId = req.params.placeId;
  const { title, description, address } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not find place to update by id", 500));
  }
  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place.", 401));
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  let location;
  try {
    location = await getCoordinates(address);
  } catch (error) {
    return next(
      new HttpError("Could not fetch location for the specified address.", 500)
    );
  }

  place.title = title;
  place.description = description;
  place.address = address;
  place.image = req.file.path;
  place.location = location;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError("Could not save updated place", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place.", 401));
  }

  if (!place) {
    return next(new HttpError("Could not find place to delete by id", 404));
  }
  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session: session });
    await place.creator.places.pull(place);
    await place.creator.save({ session: session });
    session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Could not delete place", 500));
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place deleted." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
