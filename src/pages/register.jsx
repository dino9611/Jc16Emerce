import React, { Component } from "react";
import Header from "../components/header";
import Button from "./../components/button";
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { API_URL } from "./../helper";
import {
  LoginAction,
  LoginActionThunk,
  ResetActionthunk,
  ErrorAction,
  LoadingAction,
  RegActionThunk,
} from "./../redux/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Alert } from "reactstrap";
import Loader from "react-loader-spinner";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import FormControl from "@material-ui/core/FormControl";

const Style = {
  root: {
    "& label.Mui-focused": {
      color: "#fbab7e",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#fbab7e",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fbab7e",
      },
      "&:hover fieldset": {
        borderColor: "#fbab7e",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fbab7e",
      },
    },
    marginTop: "20px",
  },
};

class Register extends Component {
  state = {
    isVisible: false,
    username: "",
    password: "",
    confirmpass: "",
    isVisibleConf: false,
  };

  toggle = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };
  toggleconf = () => {
    this.setState({ isVisibleConf: !this.state.isVisibleConf });
  };
  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onRegSubmit = (e) => {
    e.preventDefault();

    const { username, password, confirmpass } = this.state;
    // tanpa thunk
    // let data = {
    //   username,
    //   password,
    //   role: "users",
    // };
    // if (password === confirmpass) {
    //   this.props.LoadingAction();
    //   axios
    //     .get(`${API_URL}/users?username=${username}`)
    //     .then((res1) => {
    //       if (res1.data.length) {
    //         this.props.ErrorAction("username telah terdaftar");
    //       } else {
    //         axios
    //           .post(`${API_URL}/users`, data)
    //           .then((res2) => {
    //             localStorage.setItem("id", res2.data.id);
    //             this.props.LoginAction(res2.data);
    //           })
    //           .catch((err) => {
    //             this.props.ErrorAction("server error");
    //           });
    //       }
    //     })
    //     .catch((err) => {
    //       this.props.ErrorAction("server error");
    //     });
    // } else {
    //   this.props.ErrorAction("confirm dan pass harus sama");
    // }
    // * with thunk
    let data = {
      username,
      password,
      confirmpass,
    };
    this.props.RegActionThunk(data);
    // this.props.LoginActionThunk(data);
  };

  render() {
    const { classes } = this.props;
    if (this.props.dataUser.islogin) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Header />
        <div className="container mt-4 py-4">
          <div className="row " style={{ height: "70vh" }}>
            <div className="col-md-7">gambar</div>
            <div
              className="rounded col-md-5 d-flex justify-content-center align-items-center shadow"
              //   style={{ border: "3px solid #fbab7e" }}
            >
              <form onSubmit={this.onRegSubmit} style={{ width: "50%" }}>
                <h1 style={{ color: "#fbab7e" }}>Register</h1>
                <input
                  type="text"
                  placeholder="username"
                  className="form-control mt-3 inp"
                  name="username"
                  onChange={this.onInputChange}
                  value={this.state.username}
                />
                {/* material ui */}
                <FormControl variant="outlined" className={classes.root}>
                  <InputLabel
                    className="warna"
                    htmlFor="outlined-adornment-password"
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={this.state.isVisible ? "text" : "password"}
                    value={this.state.password}
                    onChange={this.onInputChange}
                    name="password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.toggle}
                          // onMouseDown={handleMouseDownPassword}
                        >
                          {this.state.isVisible ? (
                            <AiFillEye
                              style={{ color: "#fbab7e" }}
                              // onClick={this.toggle}
                            />
                          ) : (
                            <AiFillEyeInvisible
                              style={{ color: "#9f9f9f" }}
                              // onClick={this.toggle}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                </FormControl>
                <FormControl variant="outlined" className={classes.root}>
                  <InputLabel
                    className="warna"
                    htmlFor="outlined-adornment-password"
                  >
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={this.state.isVisibleConf ? "text" : "password"}
                    value={this.state.confirmpass}
                    onChange={this.onInputChange}
                    name="confirmpass"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.toggleconf}
                          // onMouseDown={handleMouseDownPassword}
                        >
                          {this.state.isVisibleConf ? (
                            <AiFillEye
                              style={{ color: "#fbab7e" }}
                              // onClick={this.toggle}
                            />
                          ) : (
                            <AiFillEyeInvisible
                              style={{ color: "#9f9f9f" }}
                              // onClick={this.toggle}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={130}
                  />
                </FormControl>
                <div className="mt-3 ">
                  {this.props.dataUser.loading ? (
                    <Loader type="Rings" color="#fbab7e" />
                  ) : (
                    <Button submit={true} className="px-4 py-2 w-50 ">
                      Register
                    </Button>
                  )}
                </div>
                {this.props.dataUser.error ? (
                  <Alert color="danger mt-2">
                    {this.props.dataUser.error}{" "}
                    <span
                      className="float-right"
                      onClick={this.props.ResetActionthunk}
                    >
                      X
                    </span>
                  </Alert>
                ) : null}
              </form>
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

export default withStyles(Style)(
  connect(MaptstatetoProps, {
    LoginAction,
    LoginActionThunk,
    ResetActionthunk,
    ErrorAction,
    LoadingAction,
    RegActionThunk,
  })(Register)
);
