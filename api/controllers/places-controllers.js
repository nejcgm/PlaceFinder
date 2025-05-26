const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const getCoordinates = require("./location");
const { validationResult } = require("express-validator");

const PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world.",
    imageUrl: "https://example.com/empire-state.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.748817,
      lng: -73.985428,
    },
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = PLACES.find((p) => p.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const places = PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    throw new HttpError("Could not find places for the provided user id.", 404);
  }
  res.json({ places });
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

  const createdPlace = {
    id: uuid(),
    title,
    description,
    imageUrl,
    address,
    location: location,
    creator,
  };

  PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const placeId = req.params.placeId;
  const { title, description } = req.body;
  const updatedPlace = { ...PLACES.find((p) => p.id === placeId) };
  const placeIndex = PLACES.findIndex((p) => p.id === placeId);
  if (!updatedPlace || placeIndex === -1) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  updatedPlace.title = title;
  updatedPlace.description = description;

  PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;
  const placeIndex = PLACES.findIndex((p) => p.id === placeId);
  if (placeIndex === -1 || !PLACES[placeIndex]) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  PLACES.splice(placeIndex, 1);

  res.status(200).json({ message: "Place deleted." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
