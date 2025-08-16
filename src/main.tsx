import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.js";
import { Provider } from "react-redux";
import store from "@redux/store";
import { AuthRestoreHandler } from "components/AuthRestoreHandler/index.js";

const container = document.getElementById("root") as HTMLElement;

createRoot(container).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthRestoreHandler />
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </Provider>
  </BrowserRouter>
);
