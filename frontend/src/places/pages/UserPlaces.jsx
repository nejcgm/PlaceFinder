import React from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";

const PLACES = [
  {
    id: "p1",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "Beautiful Beach",
    description: "A lovely beach with crystal clear water and white sand.",
    address: "123 Ocean Drive, Miami, FL",
    creator: "u1",
    location: {
      lat: 25.790654,
      lng: -80.1300455,
    },
  },
  {
    id: "p2",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    title: "Mountain Retreat",
    description: "A peaceful mountain cabin surrounded by nature.",
    address: "456 Mountain Road, Aspen, CO",
    creator: "u2",
    location: {
      lat: 39.1911,
      lng: -106.8175,
    },
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  return <PlaceList places={PLACES} />;
};

export default UserPlaces;
