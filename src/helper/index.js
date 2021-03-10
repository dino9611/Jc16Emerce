export * from "./ApiUrl";
export * from "./currency";

export const formatDate = (input) => {
  var d = new Date(input);

  return d.toLocaleString();
};
