import axios from "axios";
import { ResponseEntityPagination } from "common/models/pagination";
import { UserRequest, UserResponse } from "common/models/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAllUsers = async (
  pageNo: number,
  pageSize: number,
  sortBy: string,
  sortDir: string,
  request: string,
  accessToken: string
): Promise<ResponseEntityPagination<UserResponse>> => {
  try {
    const response = await axios.get<ResponseEntityPagination<UserResponse>>(
      `${API_BASE_URL}/users/search?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}&keyword=${request}`,
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

const getUserDetail = async (
  accessToken: string,
  id: number
): Promise<UserResponse> => {
  try {
    const response = await axios.get<UserResponse>(
      `${API_BASE_URL}/users/${id}`,
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

const updateInfo = async (
  accessToken: string,
  request: UserRequest
): Promise<UserResponse> => {
  try {
    const response = await axios.put<UserResponse>(
      `${API_BASE_URL}/users`,
      request,
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

const deleteUser = async (
  accessToken: string,
  id: number
): Promise<UserResponse> => {
  try {
    const response = await axios.delete<UserResponse>(
      `${API_BASE_URL}/users/${id}`,
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

const getNumberOfCustomersInSystem = async (
  accessToken: string
): Promise<number> => {
  try {
    const response = await axios.get<number>(
      `${API_BASE_URL}/users/count-active-users`,
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

export default {
  getAllUsers,
  getUserDetail,
  updateInfo,
  deleteUser,
  getNumberOfCustomersInSystem,
};
