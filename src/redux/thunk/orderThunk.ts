import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrderStatus } from "common/enums/OrderStatus";
import {
  OrderRequest,
  OrderResponse,
  SearchOrderRequest,
} from "common/models/order";
import { ResponseEntityPagination } from "common/models/pagination";
import OrderService from "services/OrderService";

export const getAllOrdersThunk = createAsyncThunk<
  ResponseEntityPagination<OrderResponse>,
  {
    pageNo: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    request: SearchOrderRequest;
  },
  { state: RootState }
>(
  "order/getAllOrders",
  async ({ pageNo, pageSize, sortBy, sortDir, request }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await OrderService.getAllOrders(
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        request,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "get all orders failed"
      );
    }
  }
);

export const getAllOrdersByCustomerThunk = createAsyncThunk<
  ResponseEntityPagination<OrderResponse>,
  {
    pageNo: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    request: SearchOrderRequest;
  },
  { state: RootState }
>(
  "order/getAllOrdersByCustomer",
  async ({ pageNo, pageSize, sortBy, sortDir, request }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await OrderService.getAllOrdersByCustomer(
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        request,
        accessToken
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "get all orders of customer failed"
      );
    }
  }
);

export const getOrderThunk = createAsyncThunk<
  OrderResponse,
  number,
  { state: RootState }
>("order/getOrder", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await OrderService.getOrder(accessToken, id);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "get order detail failed"
    );
  }
});

export const addOrderThunk = createAsyncThunk<
  OrderResponse,
  OrderRequest,
  { state: RootState }
>("order/addOrder", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state?.auth?.accessToken ?? null;
  try {
    const data = await OrderService.addOrder(accessToken, request);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "add order failed"
    );
  }
});

export const updateOrderThunk = createAsyncThunk<
  OrderResponse,
  {
    orderId: number;
    status: OrderStatus;
    note?: string;
  },
  { state: RootState }
>("order/updateOrder", async ({orderId, status, note}, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await OrderService.updateOrder(accessToken, orderId, status, note);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "update order failed"
    );
  }
});
