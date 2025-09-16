import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.js";
import { Provider } from "react-redux";
import store from "@redux/store";
import {
  AuthAdminRestoreHandler,
  AuthRestoreHandler,
} from "components/AuthRestoreHandler/index.js";

const container = document.getElementById("root") as HTMLElement;
const storedRefresh = localStorage.getItem("REFRESH_TOKEN_ADMIN");

createRoot(container).render(
  <BrowserRouter>
    <Provider store={store}>
      {storedRefresh ? <AuthAdminRestoreHandler /> : <AuthRestoreHandler />}
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </Provider>
  </BrowserRouter>
);
