import React, { Component } from "react";
import Header from "./../../components/header";
import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { currencyFormatter, API_URL } from "../../helper";
import axios from "axios";
import { CartAction } from "../../redux/actions";
class Cart extends Component {
  state = {
    banks: [],
    pilihanId: 0,
    modal: false,
    bukti: "",
  };

  componentDidMount() {
    // axios
    //   .get(`${API_URL}/banks`)
    //   .then((res) => {
    //     this.setState({ banks: res.data });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    var arr = [];
    var cart = this.props.dataUser.cart;
    cart.forEach((val) => {
      arr.push(axios.get(`${API_URL}/products/${val.id}`));
    });

    Promise.all(arr)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onMinusClick = (index) => {
    let cart = this.props.dataUser.cart;
    let hasil = cart[index].qty - 1;
    if (hasil < 1) {
      alert("delete saja jika qty ingin 0");
    } else {
      cart[index].qty = cart[index].qty - 1;
      let iduser = this.props.dataUser.id;
      axios
        .patch(`${API_URL}/users/${iduser}`, { cart: cart })
        .then((res) => {
          this.props.CartAction(res.data.cart);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onPlusClick = (index) => {
    // ambil data product dulu dengan id dari index
    let cart = this.props.dataUser.cart;
    let idprod = cart[index].id;
    axios
      .get(`${API_URL}/products/${idprod}`)
      .then((res) => {
        let stok = res.data.stok;
        let qty = cart[index].qty;
        let hasil = qty + 1;
        if (hasil > stok) {
          alert("qty melebihi stok");
        } else {
          cart[index].qty = hasil;
          let iduser = this.props.dataUser.id;
          axios
            .patch(`${API_URL}/users/${iduser}`, { cart: cart })
            .then((res) => {
              this.props.CartAction(res.data.cart);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCart = () => {
    return this.props.dataUser.cart.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.name}</td>
          <td>
            <img src={val.image} alt={val.name} width="200px" height="150px" />
          </td>
          <td>{currencyFormatter(val.harga)}</td>
          <td>
            <button
              className="btn btn-danger mx-2"
              onClick={() => this.onMinusClick(index)}
              disabled={val.qty === 1 ? true : false}
            >
              -
            </button>
            {val.qty}
            <button
              className="btn btn-success mx-2"
              //   disabled={v}
              //   disabled={val.qty === 5 ? true : false}
              onClick={() => this.onPlusClick(index)}
            >
              +
            </button>
          </td>
          <td>{currencyFormatter(val.harga * val.qty)}</td>
          <td>
            <button className="btn btn-danger">delete</button>
          </td>
        </tr>
      );
    });
  };

  onCheckoutClick = () => {
    console.log(this.state);
    let iduser = this.props.dataUser.id;
    let data = {
      userId: this.props.dataUser.id,
      tanggal: new Date(),
      status: "belum bayar",
      products: this.props.dataUser.cart,
      bankId: 0,
      bukti: "",
    };

    axios
      .post(`${API_URL}/transactions`, data)
      .then(() => {
        axios
          .patch(`${API_URL}/users/${iduser}`, { cart: [] })
          .then((res1) => {
            this.props.CartAction(res1.data.cart);
            this.setState({ modal: false });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  rendertotal = () => {
    let total = 0;
    this.props.dataUser.cart.forEach((val) => {
      total += val.harga * val.qty;
    });
    return total;
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderRadio = () => {
    return this.state.banks.map((val, index) => {
      return (
        <label key={index} className="mx-2">
          <input
            type="radio"
            name="pilihanId"
            onChange={this.onInputChange}
            checked={this.state.pilihanId == val.id}
            value={val.id}
            className="mr-2"
          />
          {val.nama} : {val.norek}
        </label>
      );
    });
  };

  render() {
    return (
      <div>
        {/* <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Checkout</ModalHeader>
          <ModalBody>
            <div className="mb-2">
              Total {currencyFormatter(this.rendertotal())}
            </div>
            <input
              type="text"
              className="form-control my-2"
              placeholder="input bukti"
              name="bukti"
              value={this.state.bukti}
              onChange={this.onInputChange}
            />
            <div className="my-2">{this.renderRadio()}</div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={this.onCheckoutClick}>
              checkout
            </button>
          </ModalFooter>
        </Modal> */}
        <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Checkout</ModalHeader>
          <ModalBody>Are You Sure Wanna Checkout ?</ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={this.onCheckoutClick}>
              checkout
            </button>
            <button className="btn btn-danger" onClick={this.toggle}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>
        <Header />
        <div className="container mt-5">
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Image</th>
                <th>Harga</th>
                <th>qty</th>
                <th>subtotal</th>
                <th>delete</th>
              </tr>
            </thead>
            <tbody>
              {this.renderCart()}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Total</td>
                <td>{currencyFormatter(this.rendertotal())} </td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => this.setState({ modal: true })}
                  >
                    checkout
                  </button>
                </td>
              </tr>
            </tbody>
          </Table>
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

export default connect(MaptstatetoProps, { CartAction })(Cart);
