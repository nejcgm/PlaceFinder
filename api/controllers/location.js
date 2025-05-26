const axios = require("axios");
const HttpError = require("../models/http-error.js");

async function getCoordinates(address) {
  if (!address) {
    throw new HttpError("Address is required", 400);
  }
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new HttpError("Location not found", 404);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new HttpError("Failed to fetch coordinates", 500);
  }
}

exports.getCoordinates = getCoordinates;
