export const initialStore = () => {
  const token = localStorage.getItem("token") || null;

  return {
    message: null,
    auth: {
      isAuthenticated: !!token,
      token: token,
      user: JSON.parse(localStorage.getItem("user")) || null,
    },
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "login_success":
      return {
        ...store,
        auth: {
          isAuthenticated: true,
          token: action.payload.token,
          user: action.payload.user,
        },
      };

    case "logout":
      return {
        ...store,
        auth: {
          isAuthenticated: false,
          token: null,
          user: null,
        },
      };

    case "register_success":
      return {
        ...store,
        auth: {
          isAuthenticated: false,
          token: null,
          user: null,
        },
      };

    default:
      return store;
  }
}
