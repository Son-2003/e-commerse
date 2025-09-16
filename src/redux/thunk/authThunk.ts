import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { JWTAuthResponse, PasswordChangeRequest, SignInRequest, SignUpRequest } from "common/models/auth";
import { UserResponse } from "common/models/user";
import AuthService from "services/AuthService";


export const signInUserThunk = createAsyncThunk<
  JWTAuthResponse,
  SignInRequest
>(
  "auth/signInUser",

  async (credentials, thunkAPI) => {
    try {
      const data = await AuthService.signInUser(credentials);      
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Sign in failed");
    }
  }
);

export const signInAdminThunk = createAsyncThunk<
  JWTAuthResponse,
  SignInRequest
>(
  "auth/signInAdmin",

  async (credentials, thunkAPI) => {
    try {
      const data = await AuthService.signInAdmin(credentials);      
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Sign in failed");
    }
  }
);

export const signUpCustomerThunk = createAsyncThunk<JWTAuthResponse, SignUpRequest>(
  "auth/signUpCustomer",

  async (credentials, thunkAPI) => {
    try {
      const data = await AuthService.signUpCustomer(credentials);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Sign up customer failed");
    }
  }
);

export const signUpStaffThunk = createAsyncThunk<JWTAuthResponse, SignUpRequest>(
  "auth/signUpStaff",

  async (credentials, thunkAPI) => {
    try {
      const data = await AuthService.signUpStaff(credentials);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Sign up staff failed");
    }
  }
);

export const getInfoThunk = createAsyncThunk<
  UserResponse,
  void,
  { state: RootState }
>("auth/getInfo", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const userInfo = await AuthService.getInfo(accessToken);
    return userInfo;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get user info failed"
    );
  }
});

export const getInfoAdminThunk = createAsyncThunk<
  UserResponse,
  void,
  { state: RootState }
>("auth/getInfoAdmin", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessTokenAdmin;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const userInfo = await AuthService.getInfo(accessToken);
    return userInfo;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Get admin info failed"
    );
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("auth/logoutUser", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken ? state.auth.accessToken : state.auth.accessTokenAdmin;  
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available log out");
  }
  try {
    await AuthService.logout(accessToken);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});

export const refreshTokenThunk = createAsyncThunk<
  JWTAuthResponse,
  string
>("auth/refreshToken", async (credentials, thunkAPI) => {
  try {
      const data = await AuthService.refreshToken(credentials);      
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Refresh token failed");
    }
});

export const refreshTokenAdminThunk = createAsyncThunk<
  JWTAuthResponse,
  string
>("auth/refreshTokenAdmin", async (credentials, thunkAPI) => {
  try {
      const data = await AuthService.refreshToken(credentials);      
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Refresh token admin failed");
    }
});

export const changePasswordThunk = createAsyncThunk<
  boolean,
  PasswordChangeRequest,
  { state: RootState }
>("auth/changePassword", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("No access token available");
  }
  try {
    const success: boolean = await AuthService.changePassword(
      accessToken,
      payload
    );
    return success;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Change password failed"
    );
  }
});
