import React from "react";
import Loader from "react-loader-spinner";

function Loading() {
  return (
    <div
      style={{ height: "90vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Loader
        type="BallTriangle"
        color="#fbab7e"
        height={150}
        width={150}
        radius={5}
      />
    </div>
  );
}

export default Loading;
