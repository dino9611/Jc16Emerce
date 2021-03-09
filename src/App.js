import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import NotFound from "./pages/notfound";
import Home from "./pages/Home";
import ManageProduct from "./pages/admin/manageProduct";
import Login from "./pages/login";
import { API_URL } from "./helper";
import { LoginAction } from "./redux/actions";
import { connect } from "react-redux";
import Loading from "./components/loading";
import Products from "./pages/products";
import ProductDetail from "./pages/productdetail";
import Register from "./pages/register";
import Cart from "./pages/users/cart";
import History from "./pages/users/history";

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
  state = {
    isLoading: true,
  };
  // * keep login
  componentDidMount() {
    let id = localStorage.getItem("id");

    axios
      .get(`${API_URL}/users/${id}`)
      .then((res) => {
        console.log(res);
        this.props.LoginAction(res.data);
        //* digantikan difinally this.setState({ isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        //* digantikan difinally this.setState({ isLoading: false });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    if (this.props.dataUser.role === "admin") {
      return (
        <div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/manageProd" exact component={ManageProduct} />
            <Route path="/products" exact component={Products} />
            <Route path="/product/:idprod" component={ProductDetail} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      );
    }
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/products" exact component={Products} />
          <Route path="/product/:idprod" component={ProductDetail} />
          <Route path="/cart" exact component={Cart} />
          <Route path="/history" exact component={History} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}
const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};
export default connect(MaptstatetoProps, { LoginAction })(App);
