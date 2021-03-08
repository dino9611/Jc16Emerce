import React, { Component } from "react";
import Header from "../components/header";
import axios from "axios";
import { API_URL, currencyFormatter } from "./../helper";
import Loading from "../components/loading";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "../components/button";
import { connect } from "react-redux";
class ProductDetail extends Component {
  state = {
    product: {},
    loading: true,
    qty: 1,
  };

  componentDidMount() {
    var idprod = this.props.match.params.idprod;
    var data = this.props.location.state;
    if (!data) {
      axios
        .get(`${API_URL}/products/${idprod}?_expand=category`)
        .then((res) => {
          this.setState({ product: res.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ product: data.product, loading: false });
    }
  }

  onQtyClick = (operator) => {
    if (operator === "tambah") {
      this.setState({ qty: this.state.qty + 1 });
    } else {
      var hasil = this.state.qty - 1;
      if (hasil < 1) {
        alert("nggak boleh kurang dari 1");
      } else {
        this.setState({ qty: this.state.qty - 1 });
      }
    }
  };

  onAddToCartClick = () => {
    if (
      this.props.dataUser.role === "admin" ||
      this.props.dataUser.islogin === false
    ) {
      alert(" tidak boleh beli");
    } else {
      alert("boleh beli");
    }
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <div>
        <Header />

        <div className="container">
          <div className="bg-transparent">
            <Breadcrumb className="mt-5 bg-transparent">
              <BreadcrumbItem>
                <Link to="/">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/products">Product</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{this.state.product.name}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="row mt-2">
            <div className="col-md-6 shadow">
              <img
                src={this.state.product.image}
                alt="product"
                width="100%"
                height="400vh"
              />
            </div>
            <div className="col-md-6">
              <div className=" display-4 my-2">{this.state.product.name}</div>
              <div className="my-2" style={{ fontSize: "30px" }}>
                {this.state.product.tahun}
              </div>
              <div className="my-2" style={{ fontSize: "30px" }}>
                {this.state.product.category.nama}
              </div>
              <div
                className="font-weight-bold my-2"
                style={{ fontSize: "35px" }}
              >
                {currencyFormatter(this.state.product.harga * this.state.qty)}
              </div>
              <div className="d-flex">
                <Button
                  className="py-2 px-2 "
                  style={{ fontSize: 35, width: "50px" }}
                  onClick={() => this.onQtyClick("kurang")}
                >
                  -
                </Button>
                <div
                  className="w-25 d-flex justify-content-center align-items-center"
                  style={{ fontSize: 35 }}
                >
                  {this.state.qty}
                </div>
                <Button
                  className="py-2 px-2 "
                  style={{ fontSize: 35, width: "50px" }}
                  onClick={() => this.onQtyClick("tambah")}
                >
                  +
                </Button>
              </div>
              <div className="my-3">
                <Button className="w-50 py-2" onClick={this.onAddToCartClick}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};
export default connect(MaptstatetoProps)(ProductDetail);
