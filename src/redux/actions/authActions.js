import axios from "axios";

export const LoginAction = (input) => {
  return {
    type: "LOGIN",
    payload: input,
  };
};
