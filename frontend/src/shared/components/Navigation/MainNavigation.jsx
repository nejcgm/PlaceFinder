import React, { useState } from "react";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import Backdrop from "../UIElements/Backdrop/Backdrop";
import { useMediaQuery } from "react-responsive";

const MainNavigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const onClose = () => {
    setMenuOpen(false);
  };
  return (
    <>
      {menuOpen && isMobile && (
        <>
          <Backdrop onClick={onClose} />
          <MobileMenu>
            <NavLinks />
          </MobileMenu>
        </>
      )}

      <MainHeader>
        <button
          onClick={() => setMenuOpen(true)}
          className="main-navigation__menu-btn"
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/" className="font-bold text-[24px]">
            Place Finder
          </Link>
        </h1>
        {!isMobile && (
          <nav>
            <NavLinks />
          </nav>
        )}
      </MainHeader>
    </>
  );
};

export default MainNavigation;
