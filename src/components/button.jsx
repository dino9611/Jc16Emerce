import React from "react";

const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      type={props.submit ? "submit" : "button"}
      className={"bg-tombol rounded font-weight-bold " + props.className}
    >
      {props.children}
    </button>
  );
};

export default Button;
