const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;

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

const USERS = [
  {
    id: "u1",
    name: "John Wick",
    image: "https://variety.com/wp-content/uploads/2023/03/John-Wick-3.jpg",
    places: 3,
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
  const user = PLACES.find((p) => p.creator === userId);

  if (!user) {
    throw new HttpError("Could not find a user for the provided id.", 404);
  }
  res.json({ user });
};

const createPlace = (req, res, next) => {
  const { title, description, imageUrl, address, location, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    imageUrl,
    address,
    location,
    creator,
  };

  PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
