import React, { Component } from "react";
import Header from "./../../components/header";
import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { currencyFormatter, API_URL } from "../../helper";
import axios from "axios";
import { CartAction } from "../../redux/actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
const Myswal = withReactContent(Swal);

class Cart extends Component {
  state = {
    modal: false,
    stokadmin: [],
    loading: false, //kalo mau pake button disable dibuat true dulu
    products: [],
  };

  componentDidMount() {
    // * get data products
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ products: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    // var arr = [];
    // var cart = this.props.dataUser.cart;
    // cart.forEach((val) => {
    //   arr.push(axios.get(`${API_URL}/products/${val.id}`));
    // });
    // console.log(cart, "32");
    // Promise.all(arr)
    //   .then((res) => {
    //     console.log(res);
    //     var newarr = [];
    //     res.forEach((val) => {
    //       newarr.push({ id: val.data.id, stokadmin: val.data.stok });
    //     });
    //     console.log(newarr);
    //     this.setState({ stokadmin: newarr });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     this.setState({ loading: false });
    //   });
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
          toast.error("qty melebihi " + stok);
        } else {
          cart[index].qty = hasil;
          let iduser = this.props.dataUser.id;
          // refresh cart
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

  onDeleteClick = (index) => {
    let cart = this.props.dataUser.cart;
    // start sweetalert
    Myswal.fire({
      title: `Are you sure wanna Delete ${cart[index].name} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // edit cart
        cart.splice(index, 1);
        let iduser = this.props.dataUser.id;
        // refresh cart
        axios
          .patch(`${API_URL}/users/${iduser}`, { cart: cart })
          .then((res) => {
            this.props.CartAction(res.data.cart);
            Myswal.fire("Deleted!", "Your Cart has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
              disabled={val.qty <= 1 ? true : false}
            >
              -
            </button>
            {val.qty}
            <button
              className="btn btn-success mx-2"
              //   disabled={v}
              // disabled={
              //   val.qty >= this.state.stokadmin[index].stokadmin ? true : false
              // }
              onClick={() => this.onPlusClick(index)}
            >
              +
            </button>
          </td>
          <td>{currencyFormatter(val.harga * val.qty)}</td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => this.onDeleteClick(index)}
            >
              delete
            </button>
          </td>
        </tr>
      );
    });
  };

  //? cara dengan asyn await

  onCheckoutClick = async () => {
    let iduser = this.props.dataUser.id;
    // data input to transaksi
    let data = {
      userId: this.props.dataUser.id,
      tanggal: new Date(),
      status: "belum bayar",
      products: this.props.dataUser.cart,
      bankId: 0,
      bukti: "",
    };
    // post transaksi
    await axios.post(`${API_URL}/transactions`, data);
    // edit stok products
    var cart = this.props.dataUser.cart;
    var Productsadmin = this.state.products;
    for (let i = 0; i < cart.length; i++) {
      for (let j = 0; j < Productsadmin.length; j++) {
        if (cart[i].id === Productsadmin[j].id) {
          let stokakhir = Productsadmin[j].stok - cart[i].qty;
          await axios.patch(`${API_URL}/products/${Productsadmin[j].id}`, {
            stok: stokakhir,
          });
        }
      }
    }
    // kosongin cart
    var res1 = await axios.patch(`${API_URL}/users/${iduser}`, { cart: [] });
    // refresh cart dan tutup modal
    this.props.CartAction(res1.data.cart);
    this.setState({ modal: false });
  };

  //? cara dengan promise.all dan untuk membuat disable button

  // onCheckoutClick = () => {
  //   console.log(this.state);
  //   let iduser = this.props.dataUser.id;
  //   // data input to transaksi
  //   let data = {
  //     userId: this.props.dataUser.id,
  //     tanggal: new Date(),
  //     status: "belum bayar",
  //     products: this.props.dataUser.cart,
  //     bankId: 0,
  //     bukti: "",
  //   };

  //   axios
  //     .post(`${API_URL}/transactions`, data)
  //     .then(() => {
  //       axios
  //         .patch(`${API_URL}/users/${iduser}`, { cart: [] })
  //         .then((res1) => {
  //           var stokadmin = this.state.stokadmin;
  //           var cart = this.props.dataUser.cart;
  //           var stokfetch = stokadmin.map((val, index) => {
  //             // stockfetch type datanya adalah array
  //             let stokakhir = val.stokadmin - cart[index].qty;
  //             return axios.patch(`${API_URL}/products/${val.id}`, {
  //               stok: stokakhir,
  //             });
  //           });
  //           Promise.all(stokfetch)
  //             .then(() => {
  //               this.props.CartAction(res1.data.cart);
  //               this.setState({ modal: false });
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
    if (this.state.loading) {
      return <h1>Loading</h1>;
    }
    return (
      <div>
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
