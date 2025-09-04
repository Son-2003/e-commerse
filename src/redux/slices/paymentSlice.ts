import { createPaymentLinkThunk } from "@redux/thunk/paymentThunk";
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { CheckoutResponseData } from "common/models/payment";

interface PaymentState {
  paymentLink: CheckoutResponseData | null;
  loadingPayment: boolean;
  errorPayment: string | null;
  isOpen: boolean;
  message: string | null;
}

const initialState: PaymentState = {
  paymentLink: null,
  loadingPayment: false,
  errorPayment: null,
  isOpen: false,
  message: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    closePayment: (state) => {
      state.paymentLink = null;
      state.isOpen = false;
    },
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    createPaymentLink(builder);
  },
});

function createPaymentLink(builder: ActionReducerMapBuilder<PaymentState>) {
  builder
    .addCase(createPaymentLinkThunk.pending, (state) => {
      state.loadingPayment = true;
      state.errorPayment = null;
    })
    .addCase(
      createPaymentLinkThunk.fulfilled,
      (state, action: PayloadAction<CheckoutResponseData>) => {
        state.loadingPayment = false;
        state.paymentLink = action.payload;
        state.isOpen = true;
      }
    )
    .addCase(createPaymentLinkThunk.rejected, (state, action) => {
      state.loadingPayment = false;
      state.errorPayment =
        (action.payload as string) || "Create payment link failed";
    });
}

export const { closePayment, setMessage } = paymentSlice.actions;
export default paymentSlice.reducer;
