import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Backdrop from "../Backdrop/Backdrop";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

const ModalOverlay = ({
  className,
  headerClass,
  header,
  onSubmit,
  contentClass,
  children,
  footerClass,
  footerContent,
  nodeRef,
}) => {
const content = (
    <div ref={nodeRef} className={`modal ${className}`}>
        <header className={`modal__header ${headerClass}`}>
            <h2>{header}</h2>
        </header>
        <form
            onSubmit={onSubmit ? onSubmit : (event) => event.preventDefault()}
            action=""
        >
            <div className={`modal__content ${contentClass}`}>{children}</div>
            <footer className={`modal__content ${footerClass}`}>
                {footerContent}
            </footer>
        </form>
    </div>
);
  return ReactDOM.createPortal(content, document.getElementById("modal"));
};

const Modal = ({ show, onCancel, ...props }) => {
  const nodeRef = useRef(null);
  return (
    <>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        in={show}
        timeout={200}
        classNames="modal"
        mountOnEnter
        unmountOnExit
        nodeRef={nodeRef}
      >
        <ModalOverlay {...props} nodeRef={nodeRef} />
      </CSSTransition>
    </>
  );
};

export default Modal;
