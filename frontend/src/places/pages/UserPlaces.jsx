import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/ErrorModal/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/HttpHook";

const UserPlaces = () => {
  const userId = useParams().userId;
  const { isLoading,error, sendRequest, handleErrorClear } = useHttpClient();
  const [userPlaces, setUserPlaces] = useState([]);

  useEffect(() => {
    const getUsersPlaces = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:8000/api/places/user/${userId}`
        );
        setUserPlaces(response.places);
      } catch (error) {
        console.error("Error fetching user places:", error);
      }
    };
    getUsersPlaces();
  }, [userId, sendRequest]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setUserPlaces((prevPlaces) => prevPlaces.filter(place => place.id !== deletedPlaceId));
  }

  return (
  <>
  <ErrorModal error={error} onClear={handleErrorClear} />
  {isLoading && <LoadingSpinner />}
  {!isLoading && <PlaceList places={userPlaces} onDelete={placeDeleteHandler}/>}
  </>
  );
};

export default UserPlaces;
