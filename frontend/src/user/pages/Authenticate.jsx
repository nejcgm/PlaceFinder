import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import { useForm } from "../../shared/hooks/FormHook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MATCHPASSWORD,
} from "../../shared/util/validators";
import "../../places/pages/NewPlace.css";
import { AuthContext } from "../../shared/context/AuthContext";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/ErrorModal/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import ImageUpload from "../../shared/components/FormElements/image-upload/ImageUpload";

const Register = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(false);
  const { isLoading, error, sendRequest, handleErrorClear } = useHttpClient();
  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      name: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: true,
      },
      password: {
        value: "",
        isValid: false,
      },
      confirmPassword: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const AuthenticateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:8000/api/users/login"
        : "http://localhost:8000/api/users/register";

      const formData = new FormData();
      const input = {
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      };

      if (!isLogin) {
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);
      }
      const response = await sendRequest(
        url,
        "POST",
        isLogin ? input : formData
      );
      auth.logIn(response.user.id);
    } catch (error) {
      console.error(
        "Error during authentication:",
        error.response?.data || error.message
      );
    }
  };

  const switchHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
          confirmPassword: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: "",
            isValid: true,
          },
          confirmPassword: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }

    setIsLogin((prev) => !prev);
  };

  return (
    <>
      <ErrorModal error={error} onClear={handleErrorClear} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="place-form" onSubmit={AuthenticateSubmitHandler}>
        <Input
          id="email"
          element="input"
          label="Email"
          type="text"
          validators={[VALIDATOR_EMAIL()]}
          errorText={"Enter Correct Email"}
          onInput={InputHandler}
        />
        {!isLogin && (
          <>
            <Input
              id="name"
              element="input"
              label="Name"
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              errorText={"Enter Correct Email"}
              onInput={InputHandler}
            />
            <ImageUpload
              center
              id="image"
              onInput={InputHandler}
              errorText={"Please upload an image."}
            />
          </>
        )}
        <Input
          id="password"
          element="input"
          label="Password"
          type="password"
          validators={[VALIDATOR_MINLENGTH(8)]}
          errorText={"Enter Password at least 8 Characters"}
          onInput={InputHandler}
        />
        {!isLogin && (
          <>
            <Input
              id="confirmPassword"
              element="input"
              label="Confirm Password"
              type="password"
              validators={[
                VALIDATOR_MATCHPASSWORD(() => formState.inputs.password.value),
              ]}
              errorText={"Passwords dont match"}
              onInput={InputHandler}
            />
          </>
        )}
        <Button type="submit" disabled={!formState.isValid}>
          {isLogin ? "Login" : "Register"}
        </Button>
        <Button
          inverse
          onClick={(e) => {
            switchHandler();
            e.preventDefault();
          }}
        >
          {!isLogin ? "Login" : "Register"}
        </Button>
      </form>
    </>
  );
};

export default Register;
