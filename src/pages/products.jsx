import React, { Component } from "react";
import Header from "../components/header";
import axios from "axios";
import { API_URL, currencyFormatter } from "../helper";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../components/button";
class Products extends Component {
  state = {
    products: [],
  };
  componentDidMount() {
    axios
      .get(`${API_URL}/products?_expand=category`)
      .then((res) => {
        this.setState({ products: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderProducts = () => {
    return this.state.products.map((val, index) => {
      return (
        <div key={index} className="col-md-3 p-2">
          <Card className="shadow">
            <CardImg
              top
              width="100%"
              src={val.image}
              alt="Card image cap"
              height="200vh"
            />
            <CardBody>
              <CardTitle tag="h5">{val.name}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                {currencyFormatter(val.harga)}
              </CardSubtitle>
              <Link
                to={{ pathname: `/product/${val.id}`, state: { product: val } }}
              >
                <Button className="w-100 py-2">Details</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="bg-transparent mt-5">
            <Breadcrumb className=" bg-transparent">
              <BreadcrumbItem>
                <Link to="/">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Product</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="row">{this.renderProducts()}</div>
        </div>
      </div>
    );
  }
}

export default Products;
