import React, { Component } from "react";
import Header from "../../components/header";
import Button from "../../components/button";
import {
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InputGroup,
  Button as ButtonStrap,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import axios from "axios";
import { API_URL, currencyFormatter } from "../../helper";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";

const Myswal = withReactContent(Swal);

class ManageProduct extends Component {
  state = {
    products: [],
    AddData: {
      name: "",
      image: "",
      tahun: "",
      harga: "",
      deskripsi: "",
      categoryId: 0,
    },
    categories: [],
    modalAdd: false,
    page: 1,
    totaldata: 0,
    limit: 2,
  };

  componentDidMount() {
    axios
      .get(
        `${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=2 `
      )
      .then((res) => {
        axios
          .get(`${API_URL}/categories`)
          .then((res1) => {
            this.setState({
              products: res.data,
              categories: res1.data,
              totaldata: res.headers["x-total-count"],
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevprops, prevstate) {
    if (this.state.page !== prevstate.page) {
      axios
        .get(
          `${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=2 `
        )
        .then((res) => {
          this.setState({
            products: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  renderProducts = () => {
    return this.state.products.map((val, index) => {
      let x = 2 * (this.state.page - 1);
      return (
        <tr key={val.id}>
          <td width="100px">{x + index + 1}</td>
          <td width="100px">{val.name}</td>
          <td width="200px">
            <img src={val.image} alt={val.name} width="200px" height="150px" />
          </td>
          <td width="50px">{val.tahun}</td>
          <td width="150px">{currencyFormatter(val.harga)}</td>
          <td width="120px">{val.category.nama}</td>
          <td>{val.deskripsi}</td>
          <td>
            <span className="mx-2 text-primary">
              <FaEdit />
            </span>
            <span
              onClick={() => this.OnDeleteClick(index)}
              className="mx-2 text-danger"
            >
              <FaTrash />
            </span>
          </td>
        </tr>
      );
    });
  };

  renderCategories = () => {
    return this.state.categories.map((val, index) => {
      return (
        <option value={val.id} key={index}>
          {val.nama}
        </option>
      );
    });
  };

  renderPaging = () => {
    let { limit, totaldata, page } = this.state;
    let berapaPaging = Math.ceil(totaldata / limit);
    let paging = [];
    for (let i = 0; i < berapaPaging; i++) {
      if (i + 1 == page) {
        paging.push(
          <PaginationItem active>
            <PaginationLink>{i + 1}</PaginationLink>
          </PaginationItem>
        );
      } else {
        paging.push(
          <PaginationItem onClick={() => this.setState({ page: i + 1 })}>
            <PaginationLink>{i + 1}</PaginationLink>
          </PaginationItem>
        );
      }
    }
    return paging;
  };

  toggle = () => {
    this.setState({ modalAdd: !this.state.modalAdd });
  };

  onAddDataChange = (e) => {
    let AddDatamute = this.state.AddData;
    AddDatamute[e.target.name] = e.target.value;
    this.setState({ AddData: AddDatamute });
  };

  onAddDataClick = () => {
    const {
      name,
      categoryId,
      deskripsi,
      harga,
      tahun,
      image,
    } = this.state.AddData;
    var dataPost = this.state.AddData;
    if (name && categoryId && deskripsi && harga && tahun && image) {
      axios
        .post(`${API_URL}/products`, dataPost) //* datapost sudah object param ke 2 harus obj
        .then(() => {
          axios
            .get(
              `${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=2`
            )
            .then((res) => {
              var obj = {
                name: "",
                image: "",
                tahun: "",
                harga: "",
                deskripsi: "",
                categoryId: 0,
              };
              this.setState({
                products: res.data,
                modalAdd: false,
                AddData: obj,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("harus diisi bro");
    }
  };

  OnDeleteClick = (index) => {
    let id = this.state.products[index].id;
    let namaProd = this.state.products[index].name;
    Swal.fire({
      title: `Are you sure wanna Delete ${namaProd} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/products/${id}`)
          .then(() => {
            axios
              .get(
                `${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=2`
              )
              .then((res) => {
                this.setState({ products: res.data });
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  render() {
    return (
      <div>
        <Header />
        <Modal size="lg" isOpen={this.state.modalAdd} toggle={this.toggle}>
          <ModalHeader className="warna" toggle={this.toggle}>
            Add Data
          </ModalHeader>
          <ModalBody>
            <input
              className="form-control my-1"
              type="text"
              name="name"
              value={this.state.AddData.name}
              placeholder="Nama Product"
              onChange={this.onAddDataChange}
            />
            <input
              className="form-control my-1"
              type="text"
              name="image"
              placeholder="Foto"
              value={this.state.AddData.image}
              onChange={this.onAddDataChange}
            />
            <input
              className="form-control my-1"
              type="number"
              name="tahun"
              placeholder="Tahun"
              value={this.state.AddData.tahun}
              onChange={this.onAddDataChange}
            />
            <InputGroup>
              <input
                className="form-control my-1"
                type="number"
                name="harga"
                placeholder="Harga dalam juta"
                value={this.state.AddData.harga}
                onChange={this.onAddDataChange}
              />
              <ButtonStrap color="light">Juta</ButtonStrap>
            </InputGroup>
            <select
              className="form-control my-1"
              name="categoryId"
              value={this.state.AddData.categoryId}
              onChange={this.onAddDataChange}
            >
              <option value="0" selected hidden>
                Pilih Category
              </option>
              {this.renderCategories()}
            </select>
            <textarea
              className="form-control my-1"
              name="deskripsi"
              placeholder="deskripsi"
              value={this.state.AddData.deskripsi}
              cols="30"
              rows="10"
              onChange={this.onAddDataChange}
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <Button className="px-4 py-2" onClick={this.onAddDataClick}>
              Add Data
            </Button>
          </ModalFooter>
        </Modal>

        <div className="mx-5 my-3">
          <Button
            className="px-4 py-2"
            onClick={() => this.setState({ modalAdd: true })}
          >
            Add Data
          </Button>
          <div className="my-2" style={{ width: "30%" }}>
            <input
              type="search"
              className="form-control"
              placeholder="nama products"
            />
          </div>
          <Table className="mt-3" striped>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Product</th>
                <th>Foto</th>
                <th>Thn</th>
                <th>Harga</th>
                <th>Category</th>
                <th>Deskripsi</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderProducts()}</tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Pagination>{this.renderPaging()}</Pagination>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageProduct;
