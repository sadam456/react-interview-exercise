import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; // <-- Import BrowserRouter
import "./index.scss";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import "leaflet/dist/leaflet.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/react-interview-exercise/">
      {" "}
      {/* <-- Wrap App with the Router here */}
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
