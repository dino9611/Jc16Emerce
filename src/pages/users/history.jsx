import React, { Component } from "react";
import axios from "axios";
import Header from "../../components/header";
import { API_URL, currencyFormatter } from "../../helper";
import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { connect } from "react-redux";

class History extends Component {
  state = {
    banks: [],
    pilihanId: 0,
    modal: false,
    modalDetail: false,
    bukti: "",
    history: [],
    indexdetail: -1,
    products: [],
  };
  async componentDidMount() {
    try {
      var res = await axios.get(`${API_URL}/banks`);
      var res1 = await axios.get(
        `${API_URL}/transactions?userId=${this.props.dataUser.id}`
      );
      var products = await axios.get(`${API_URL}/products`);
      this.setState({
        banks: res.data,
        history: res1.data,
        products: products.data,
      });
    } catch (error) {
      console.log(error);
    }
    // whithout async-await
    // axios
    //   .get(`${API_URL}/banks`)
    //   .then((res) => {
    //     this.setState({ banks: res.data });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  rendertotal = () => {
    // let total = 0;
    // if (this.state.history.length) {
    //   this.state.history.products.forEach((val) => {
    //     total += val.harga * val.qty;
    //   });
    // }
    // return total;
  };
  rendertotalDetail = () => {
    let total = 0;

    this.state.history[this.state.indexdetail].products.forEach((val) => {
      total += val.harga * val.qty;
    });

    return total;
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  toggledetail = () => {
    this.setState({ modalDetail: !this.state.modalDetail });
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

  renderdetail = () => {
    var indexdetail = this.state.indexdetail;
    return this.state.history[indexdetail].products.map((val, index) => {
      return (
        <tr key={index}>
          <td>{val.name}</td>
          <td>{currencyFormatter(val.harga)}</td>
          <td>{val.qty}</td>
          <td>{currencyFormatter(val.qty * val.harga)}</td>
        </tr>
      );
    });
  };

  onDetailClick = (index) => {
    this.setState({ indexdetail: index, modalDetail: true });
  };

  //   onBatalClick = async (index) => {
  //     var productsAdmin = this.state.products;
  //     var producthistory = this.state.history[index].products;
  //     console.log(productsAdmin);
  //     console.log(producthistory);
  //     for (let i = 0; i < producthistory.length; i++) {
  //       for (let j = 0; j < productsAdmin.length; j++) {
  //         if (producthistory[i].id == productsAdmin[j].id) {
  //           let stocknew = producthistory[i].qty + productsAdmin[j].stok;
  //           await axios.patch(`${API_URL}/products/${productsAdmin[j].id}`, {
  //             stok: stocknew,
  //           });
  //         }
  //       }
  //     }
  //     await axios.patch(
  //       `${API_URL}/transactions/${this.state.history[index].id}`,
  //       {
  //         status: "batal",
  //       }
  //     );
  //     var res1 = await axios.get(
  //       `${API_URL}/transactions?userId=${this.props.dataUser.id}`
  //     );
  //     this.setState({ history: res1.data });
  //   };

  renderHistory = () => {
    return this.state.history.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.tanggal}</td>
          <td>{val.status}</td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => this.onBatalClick(index)}
              disabled={val.status === "batal"}
            >
              Batal
            </button>
          </td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => this.onDetailClick(index)}
              disabled={val.status === "batal"}
            >
              Bayar
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div>
        {this.state.indexdetail < 0 ? null : (
          <Modal
            size="lg"
            centered
            isOpen={this.state.modalDetail}
            toggle={this.toggledetail}
          >
            <ModalHeader toggle={this.toggledetail}>
              Detail transaksi
            </ModalHeader>
            <ModalBody>
              <Table>
                <thead>
                  <tr>
                    <th>nama</th>
                    <th>harga</th>
                    <th>qty</th>
                    <th>subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderdetail()}
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Total</th>
                    <th>{currencyFormatter(this.rendertotalDetail())}</th>
                  </tr>
                </tbody>
              </Table>
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
              <button className="btn btn-success">Bayar</button>
              <button className="btn btn-primary">tutup</button>
            </ModalFooter>
          </Modal>
        )}

        <Header />
        <div className="container mt-5">
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>status</th>
                <th>batal</th>
                <th>detail</th>
              </tr>
            </thead>
            <tbody>{this.renderHistory()}</tbody>
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
export default connect(MaptstatetoProps)(History);
