import React, {useContext} from "react";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import { useForm } from "../../shared/hooks/FormHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./NewPlace.css";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/ErrorModal/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";
import {useNavigate} from "react-router-dom";

const NewPlace = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, handleErrorClear } = useHttpClient();
  const [formState, InputHandler] = useForm(
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
    },
    false
  );

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    try {
      sendRequest("http://localhost:8000/api/places", "POST", {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
        imageUrl: formState.inputs.image.value,
        creator: auth.userId,
      });
      navigate('/')
    } catch (error) {
      console.error("Error submitting place:", error);
    }
  };

  return (
    <>
      {error && <ErrorModal error={error} onClear={handleErrorClear} />}
      {isLoading && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            element="input"
            label="Title"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText={"Enter Title"}
            onInput={InputHandler}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText={"Description is to short"}
            onInput={InputHandler}
          />
          <Input
            id="address"
            element="input"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText={"Enter Address"}
            onInput={InputHandler}
          />
          <Input
            id="image"
            element="input"
            label="Image URL"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText={"Enter Image URL"}
            onInput={InputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Add Place
          </Button>
        </form>
      )}
    </>
  );
};

export default NewPlace;
