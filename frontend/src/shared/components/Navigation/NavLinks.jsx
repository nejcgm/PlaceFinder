import React from "react";
import { NavLink } from "react-router-dom";

const NavLinks = () => {
  return (
    <div className="flex flex-col md:flex-row text-[20px] md:text-[18px] gap-4">
      <div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "font-bold" : undefined)}
        >
          All Users
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/u1/places"
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
      <div>
        <NavLink
          to="/auth"
          className={({ isActive }) => (isActive ? "font-bold" : undefined)}
        >
          Authenticate
        </NavLink>
      </div>
    </div>
  );
};

export default NavLinks;
