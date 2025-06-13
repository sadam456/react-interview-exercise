import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; // <-- Import BrowserRouter
import "./index.scss";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import "leaflet/dist/leaflet.css";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReviewedItemsProvider } from "./context/ReviewedItemsContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/react-interview-exercise/">
      {" "}
      {/* <-- Wrap App with the Router here */}
      <ChakraProvider theme={theme}>
        <FavoritesProvider>
          <ReviewedItemsProvider>
            <App />
          </ReviewedItemsProvider>
        </FavoritesProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
