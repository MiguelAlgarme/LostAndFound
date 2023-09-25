import React from "react";

interface Props {
  text: string;
  color?: "success" | "secondary" | "danger" | "primary";
  onClick: () => void;
}
const Button = ({ text, color = "success", onClick }: Props) => {
  return (
    <div
      className={"btn btn-" + color}
      onClick={onClick}
      data-bs-dismiss="alert"
      aria-label="Close"
    >
      {text}
    </div>
  );
};

export default Button;
