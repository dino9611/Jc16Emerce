const INITIAL_STATE = {
  id: 0,
  username: "",
  password: "",
  role: "",
  islogin: false,
  loading: false,
  error: "",
  cart: [],
};

const AuthReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
        islogin: true,
        loading: false,
        error: "",
      };
    case "LOADING":
      return { ...state, loading: true };
    case "ERROR":
      return { ...state, error: action.error, loading: false };
    case "RESET":
      return { ...state, error: "", loading: false };
    case "LOGOUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default AuthReducers;
