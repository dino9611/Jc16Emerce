const INITIAL_STATE = {
  id: 0,
  username: "",
  password: "",
  role: "",
  islogin: false,
};

const AuthReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, islogin: true };
    default:
      return state;
  }
};

export default AuthReducers;
