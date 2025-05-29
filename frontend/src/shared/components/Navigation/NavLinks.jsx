import React from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Button from "../FormElements/Button/Button";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  return (
    <div className="flex flex-col md:flex-row text-[20px] md:text-[18px] gap-4 items-center">
      <div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "font-bold" : undefined)}
        >
          All Users
        </NavLink>
      </div>
      {auth.isLoggedIn && (
        <>
          <div>
            <NavLink
              to={`/${auth.userId}/places`}
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              My Places
            </NavLink>
          </div>
          <div>
            <NavLink
              to="/places/new"
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              Add Places
            </NavLink>
          </div>
        </>
      )}
      {!auth.isLoggedIn && (
        <div>
          <NavLink
            to="/auth"
            className={({ isActive }) => (isActive ? "font-bold" : undefined)}
          >
            Authenticate
          </NavLink>
        </div>
      )}
      {auth.isLoggedIn && (
        <Button onClick={auth.logOut} size="small">
          Log Out
        </Button>
      )}
    </div>
  );
};

export default NavLinks;
