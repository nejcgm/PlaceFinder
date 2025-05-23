import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./MobileMenu.css";

const MobileMenu = ({ children, show, onClick }) => {
  const nodeRef = useRef(null);
  const content = (
    <CSSTransition
      in={show}
      timeout={300}
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
      classNames="mobile-menu"
    >
      <div
        ref={nodeRef}
        className="w-[60%] bg-white py-[64px] justify-center flex relative z-20 h-screen"
        onClick={onClick}
      >
        {children}
      </div>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("dialog"));
};

export default MobileMenu;
