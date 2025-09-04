import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CheckoutResponseData, CreatePaymentRequest } from "common/models/payment";
import PaymentService from "services/PaymentService";

export const createPaymentLinkThunk = createAsyncThunk<
  CheckoutResponseData,
  CreatePaymentRequest,
  { state: RootState }
>("payment/createPaymentLink", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state?.auth?.accessToken ?? null;
  try {
    const data = await PaymentService.createPaymentLink(accessToken, request);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "create payment link failed"
    );
  }
});