import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import orderReducer from "./slices/orderSlice";
import feedbackReducer from "./slices/feedbackSlice";
import paymentReducer from "./slices/paymentSlice";
import chatReducer from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    user: userReducer,
    order: orderReducer,
    feedback: feedbackReducer,
    payment: paymentReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
