import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseEntityPagination } from "common/models/pagination";
import { UserRequest, UserResponse } from "common/models/user";
import UserService from "services/UserService";

export const getAllUsersThunk = createAsyncThunk<
  ResponseEntityPagination<UserResponse>,
  {
    pageNo: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    request: string;
  },
  { state: RootState }
>(
  "user/getAllUsers",
  async ({ pageNo, pageSize, sortBy, sortDir, request }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await UserService.getAllUsers(
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
        error.response?.data?.message || "get all users failed"
      );
    }
  }
);

export const getUserDetailThunk = createAsyncThunk<
  UserResponse,
  number,
  { state: RootState }
>("user/getUserDetail", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await UserService.getUserDetail(accessToken, id);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "get user detail failed"
    );
  }
});

export const updateInfoThunk = createAsyncThunk<
  UserResponse,
  UserRequest,
  { state: RootState }
>("user/updateInfo", async (request, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await UserService.updateInfo(accessToken, request);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "update user info failed"
    );
  }
});

export const deleteUserThunk = createAsyncThunk<
  UserResponse,
  number,
  { state: RootState }
>("user/deleteUser", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await UserService.deleteUser(accessToken, id);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "delete user failed"
    );
  }
});

export const getNumberOfCustomersInSystemThunk = createAsyncThunk<
  number,
  void,
  { state: RootState }
>("user/getNumberOfCustomersInSystem", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const data = await UserService.getNumberOfCustomersInSystem(accessToken);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "get number of customer in system failed"
    );
  }
});
