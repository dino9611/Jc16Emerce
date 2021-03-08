import React, { Component } from "react";
import Header from "../components/header";

class Home extends Component {
  state = {};
  render() {
    return (
      <div>
        <Header />
        <div className="container mt-5"></div>
      </div>
    );
  }
}

export default Home;
