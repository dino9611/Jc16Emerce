import axios from "axios";
import { API_URL } from "../../helper";

//* without thunk
export const LoginAction = (input) => {
  return {
    type: "LOGIN",
    payload: input,
  };
};

// TODO Register
//? 1. input username, password , comfirm password dimana punya besar dan kecil minimal 6 char
//? 2. sama atau nggak pass dan confirmpass jika beda jangan dilanjutkan kasih tau user untuk ubah
//? 3. di cek di axios bahwa username sudah digunakan atau tidak
//? 4. jika sudah digunakan maka kasih tau user bahwa username telah dipakai, jika tidak lanjutkan ke step 5
//? 5. post data  ke json data users
//? 6. jika berhasil, redirect langsung ke home dengan cara mengupdate data Auth reducers sama seperti Login
//?. cat: jangan lupa set localstroge seperti login agar dia bisa keep login

//* with thunk
export const LoginActionThunk = (input) => {
  var { username, password } = input;
  return (dispatch) => {
    dispatch({ type: "LOADING" });
    axios
      .get(`${API_URL}/users?username=${username}&password=${password}`)
      .then((res) => {
        if (res.data.length) {
          localStorage.setItem("id", res.data[0].id);
          dispatch({ type: "LOGIN", payload: res.data[0] });
        } else {
          dispatch({ type: "ERROR", error: "user tidak ditemukan" });
        }
      })
      .catch((err) => {
        console.log(err.response.statusText);
        dispatch({ type: "ERROR", error: "server error" });
      });
  };
};

export const ResetAction = () => {
  return {
    type: "RESET",
  };
};
export const ResetActionthunk = () => {
  return (dispatch) => {
    dispatch({ type: "RESET" });
  };
};
