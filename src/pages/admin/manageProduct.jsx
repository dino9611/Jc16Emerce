import React, { Component } from "react";
import Header from "../../components/header";
import { Table } from "reactstrap";

class ManageProduct extends Component {
  state = {
    products: [],
  };

  render() {
    return (
      <div>
        <Header />
        <div className="m-5">
          <h1>MANAGE product</h1>
        </div>
      </div>
    );
  }
}

export default ManageProduct;
