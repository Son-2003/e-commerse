import axios from "axios";
import {
  JWTAuthResponse,
  PasswordChangeRequest,
  SignInRequest,
  SignUpRequest,
} from "common/models/auth";
import { UserResponse } from "common/models/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL_LOG_OUT = import.meta.env.VITE_API_BASE_URL_LOG_OUT;

const signInUser = async (
  credentials: SignInRequest
): Promise<JWTAuthResponse> => {
  try {
    const response = await axios.post<JWTAuthResponse>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const signUpCustomer = async (
  credentials: SignUpRequest
): Promise<JWTAuthResponse> => {
  try {
    const response = await axios.post<JWTAuthResponse>(
      `${API_BASE_URL}/auth/register/customer`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const signUpStaff = async (
  credentials: SignUpRequest
): Promise<JWTAuthResponse> => {
  try {
    const response = await axios.post<JWTAuthResponse>(
      `${API_BASE_URL}/auth/register/staff`,
      credentials
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const changePassword = async (
  accessToken: string,
  payload: PasswordChangeRequest
): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(
      `${API_BASE_URL}/auth/change-password`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const getInfo = async (accessToken: string): Promise<UserResponse> => {
  try {
    const response = await axios.get<UserResponse>(
      `${API_BASE_URL}/auth/info`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const logout = async (accessToken: string): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL_LOG_OUT}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error: any) {
    throw error;
  }
};

const refreshToken = async (refreshToken: string): Promise<JWTAuthResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default {
  signInUser,
  signUpCustomer,
  signUpStaff,
  getInfo,
  logout,
  changePassword,
  refreshToken,
};
