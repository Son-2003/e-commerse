import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FeedbackRequest,
  FeedbackResponse,
  FeedbackSummaryResponse,
  SearchFeedbackRequest,
} from "common/models/feedback";
import { ResponseEntityPagination } from "common/models/pagination";
import FeedbackService from "services/FeedbackService";

export const getAllFeedbacksThunk = createAsyncThunk<
  ResponseEntityPagination<FeedbackResponse>,
  {
    pageNo: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    request: SearchFeedbackRequest;
  }
>(
  "feedback/getAllFeedbacks",
  async ({ pageNo, pageSize, sortBy, sortDir, request }, thunkAPI) => {
    try {
      const data = await FeedbackService.getAllFeedbacks(
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        request
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "get all feedbacks failed"
      );
    }
  }
);

export const getSummaryFeedbackThunk = createAsyncThunk<
  FeedbackSummaryResponse,
  SearchFeedbackRequest
>(
  "feedback/getSummaryFeedback",
  async (request, thunkAPI) => {
    try {
      const data = await FeedbackService.getSummaryFeedback(
        request
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "get summary feedbacks failed"
      );
    }
  }
);

export const getAllFeedbacksOfOrderThunk = createAsyncThunk<
  FeedbackResponse[],
  number,
  { state: RootState }
>("feedback/getAllFeedbacksOfOrder", async (orderid, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FeedbackService.getAllFeedbacksOfOrder(
      accessToken,
      orderid
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "get all feedbacks of order failed"
    );
  }
});

export const createFeedbackThunk = createAsyncThunk<
  FeedbackResponse[],
  {
    orderId: number;
    requests: FeedbackRequest[];
  },
  { state: RootState }
>("feedback/createFeedback", async ({ orderId, requests }, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state?.auth?.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FeedbackService.createFeedback(
      accessToken,
      orderId,
      requests
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "create feedback failed"
    );
  }
});

export const updateFeedbackThunk = createAsyncThunk<
  FeedbackResponse,
  FeedbackRequest,
  { state: RootState }
>("feedback/updateFeedback", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FeedbackService.updateFeedback(accessToken, request);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "update feedback failed"
    );
  }
});

export const deleteFeedbackThunk = createAsyncThunk<
  FeedbackResponse,
  number,
  { state: RootState }
>("feedback/deleteFeedback", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await FeedbackService.deleteFeedback(accessToken, id);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "delete feedback failed"
    );
  }
});
