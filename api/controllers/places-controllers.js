const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { getCoordinates } = require("./location");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const place = require("../models/place");

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
    throw new HttpError("Could not find places for the provided user id.", 404);
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

  const { title, description, imageUrl, address, creator } = req.body;

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
    image: "https://example.com/empire-state.jpg",
    address,
    location,
    creator,
  });

  try {
    await createdPlace.save();
  } catch {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const placeId = req.params.placeId;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not find place to update by id", 500));
  }

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  place.title = title;
  place.description = description;

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
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not find place to delete by id", 500));
  }
  try {
    await place.deleteOne();
  } catch (err) {
    return next(new HttpError("Could not delete place", 500));
  }
  res.status(200).json({ message: "Place deleted." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
