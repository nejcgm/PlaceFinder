import React, { useState,useContext } from "react";
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

const Register = () => {
  const auth = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true);
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
      password: {
        value: "",
        isValid: false,
      },
      confirmPassword: {
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

  const AuthenticateSubmitHandler = (event) => {
    event.preventDefault();
    auth.logIn()
    console.log(formState.inputs);
  };
console.log(formState.isValid)
  const switchHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          confirmPassword: undefined,
          image: undefined,
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
          confirmPassword: {
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
    }

    setIsLogin((prev) => !prev);
  };
  

  return (
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
        <Input
          id="name"
          element="input"
          label="Name"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText={"Enter Correct Email"}
          onInput={InputHandler}
        />
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
              VALIDATOR_MATCHPASSWORD(formState.inputs.password.value || ""),
            ]}
            errorText={"Passwords dont match"}
            onInput={InputHandler}
          />
          <Input
            id="image"
            element="input"
            label="Profile Image"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText={"Chose profile image"}
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
          switchHandler(), e.preventDefault();
        }}
      >
        {!isLogin ? "Login" : "Register"}
      </Button>
    </form>
  );
};

export default Register;
