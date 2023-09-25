import React from "react";
import { ReactNode } from "react"; //Allows you to use html, connection with the Props interface
interface Props {
  text: ReactNode;
  onClose: () => void;
}

const Alert = ({ text, onClose }: Props) => {
  return (
    <div className="alert alert-primary alert-dismissible fade show">
      {text}{" "}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose} //Calls onClose
      ></button>
    </div>
  );
};

export default Alert;
