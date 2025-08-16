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
  const response = await axios.post<JWTAuthResponse>(
    `${API_BASE_URL}/auth/login`,
    credentials
  );  
  return response.data;
};

const signUpCustomer = async (
  credentials: SignUpRequest
): Promise<JWTAuthResponse> => {
  const response = await axios.post<JWTAuthResponse>(
    `${API_BASE_URL}/auth/register/customer`,
    credentials
  );

  return response.data;
};

const signUpStaff = async (
  credentials: SignUpRequest
): Promise<JWTAuthResponse> => {
  const response = await axios.post<JWTAuthResponse>(
    `${API_BASE_URL}/auth/register/staff`,
    credentials
  );

  return response.data;
};

const changePassword = async (
  accessToken: string,
  payload: PasswordChangeRequest
): Promise<boolean> => {
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
};

const getInfo = async (accessToken: string): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(`${API_BASE_URL}/auth/info`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const logout = async (accessToken: string): Promise<void> => {
  await axios.post(
    `${API_BASE_URL_LOG_OUT}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};



export default {
  signInUser,
  signUpCustomer,
  signUpStaff,
  getInfo,
  logout,
  changePassword,
};
