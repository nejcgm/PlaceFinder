import React, { useEffect } from "react";
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

const UpdatePlace = () => {
  const placeId = useParams().placeId;

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
    },
    false
  );

  const identifiedPlace = PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="flex flex-col items-center py-4">
        <Card>Place does not exist</Card>
      </div>
    );
  }

  return (
    <>
      {" "}
      {/* replace later */}
      {formState.inputs.title.value && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Enter Title"
            onInput={InputHandler}
            defaultValue={formState.inputs.title.value}
            defaultIsValid={formState.inputs.title.isValid}
          />

          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Description is to short"
            onInput={InputHandler}
            defaultValue={formState.inputs.description.value}
            defaultIsValid={formState.inputs.description.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
