import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import NotFound from "./pages/notfound";
import Home from "./pages/Home";
import ManageProduct from "./pages/admin/manageProduct";
// import Header from "./components/header";

// *feature :
// * manage product
// * login/register
// * landing page
// * proteksi admin dan user dari page yang tidak seharusnya
// * productdetails
// * add cart
// * pembayaran
// * confirm pembayaran
// * history

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/manageProd" exact component={ManageProduct} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
