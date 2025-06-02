import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card/Card";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import { useForm } from "../../shared/hooks/FormHook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./NewPlace.css";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/ErrorModal/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/image-upload/ImageUpload";
import { AuthContext } from "../../shared/context/AuthContext";
import { useContext } from "react";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, handleErrorClear } = useHttpClient();
  const [identifiedPlace, setIdentifiedPlace] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(identifiedPlace);
  }, [identifiedPlace]);

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const getPlaceById = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:8000/api/places/${placeId}`
        );
        setFormData(
          {
            title: {
              value: response.title,
              isValid: true,
            },
            description: {
              value: response.description,
              isValid: true,
            },
            address: {
              value: response.address,
              isValid: true,
            },
            image: {
              value: response.image,
              isValid: true,
            },
          },
          true
        );
        setIdentifiedPlace(response.place);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    getPlaceById();
  }, [placeId, sendRequest, setFormData]);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    try {
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        `http://localhost:8000/api/places/${placeId}`,
        "PATCH",
        formData,
        { Authorization: "Bearer " + auth.token }
      );
      console.log("Place updated successfully");
      navigate(`/${identifiedPlace.creator}/places`);
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!identifiedPlace && !error) {
    return (
      <div className="flex flex-col items-center py-4">
        <Card>Place does not exist</Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={handleErrorClear} />
      {!isLoading && identifiedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Enter Title"
            onInput={InputHandler}
            defaultValue={identifiedPlace.title}
            defaultIsValid={true}
          />

          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Description is to short"
            onInput={InputHandler}
            defaultValue={identifiedPlace.description}
            defaultIsValid={true}
          />
          <Input
            id="address"
            element="input"
            type="text"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Enter Address"
            onInput={InputHandler}
            defaultValue={identifiedPlace.address}
            defaultIsValid={true}
          />
          <ImageUpload
            center
            id="image"
            onInput={InputHandler}
            errorText={"Please upload an image."}
          />

          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
          <Button inverse to={`/`}>
            Cancel
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
