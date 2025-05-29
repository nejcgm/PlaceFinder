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
const UpdatePlace = () => {
  const placeId = useParams().placeId;
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
      imageUrl: {
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
            imageUrl: {
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
    try {
      await sendRequest(`http://localhost:8000/api/places/${placeId}`, "PATCH", {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
        imageUrl: formState.inputs.imageUrl.value,
      });
      console.log("Place updated successfully");
      navigate(`/${identifiedPlace.creator}/places`);
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };
if (isLoading) {
  return (
    <LoadingSpinner/>
  );
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
        <Input
          id="imageUrl"
          element="input"
          type="text"
          label="Image URL"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Enter Image URL"
          onInput={InputHandler}
          defaultValue={identifiedPlace.image}
          defaultIsValid={true}
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
