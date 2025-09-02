import "./index.css"
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store/store";
import App from "@/App";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastStyle={{
        background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
        border: "1px solid #4C1D95",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        color: "#F1F5F9"
      }}
style={{ zIndex: 9999 }}
    />
    </BrowserRouter>
  </Provider>
);