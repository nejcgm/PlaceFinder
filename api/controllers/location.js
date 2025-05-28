const axios = require("axios");
const HttpError = require("../models/http-error.js");

async function getCoordinates(address) {
  if (!address || typeof address !== "string") {
    throw new HttpError("Address is required and must be a string", 400);
  }
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          format: "json",
          q: address,
          addressdetails: 1,
          limit: 1
        },
        headers: {
          "User-Agent": "PlaceFinder (nejc.gjura-meke@inova.si)"
        },
        timeout: 5000 
      }
    );
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        lat: parseFloat(lat),
        long: parseFloat(lon)
      };
    } else {
      throw new HttpError("Location not found", 404);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message || error);
    throw new HttpError("Failed to fetch coordinates", 500);
  }
}

exports.getCoordinates = getCoordinates;

