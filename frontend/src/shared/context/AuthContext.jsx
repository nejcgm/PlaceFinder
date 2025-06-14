import React, { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  logIn: () => {},
  logOut: () => {},
});
