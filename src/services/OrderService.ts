import axios from "axios";
import { OrderStatus } from "common/enums/OrderStatus";
import {
  OrderInfo,
  OrderRequest,
  OrderResponse,
  SearchOrderRequest,
} from "common/models/order";

import { ResponseEntityPagination } from "common/models/pagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAllOrders = async (
  pageNo: number,
  pageSize: number,
  sortBy: string,
  sortDir: string,
  request: SearchOrderRequest,
  accessToken: string
): Promise<ResponseEntityPagination<OrderResponse>> => {
  try {
    const response = await axios.post<ResponseEntityPagination<OrderResponse>>(
      `${API_BASE_URL}/orders/search?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`,
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

const getAllOrdersByCustomer = async (
  pageNo: number,
  pageSize: number,
  sortBy: string,
  sortDir: string,
  request: SearchOrderRequest,
  accessToken: string
): Promise<ResponseEntityPagination<OrderResponse>> => {
  try {
    const response = await axios.post<ResponseEntityPagination<OrderResponse>>(
      `${API_BASE_URL}/orders/search-customer?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`,
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

const getOrder = async (
  accessToken: string,
  id: number
): Promise<OrderResponse> => {
  try {
    const response = await axios.get<OrderResponse>(
      `${API_BASE_URL}/orders/${id}`,
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

const getOrderInfoOfCustomer = async (
  accessToken: string
): Promise<OrderInfo> => {
  try {
    const response = await axios.get<OrderInfo>(
      `${API_BASE_URL}/orders/info`,
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

const addOrder = async (
  accessToken?: string | null,
  request?: OrderRequest
): Promise<OrderResponse> => {
  try {
    const headers: Record<string, string> = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.post<OrderResponse>(
      `${API_BASE_URL}/orders`,
      request,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const updateOrder = async (
  accessToken: string,
  orderId: number,
  status: OrderStatus,
  note?: string
): Promise<OrderResponse> => {
  try {
    const response = await axios.put<OrderResponse>(
      `${API_BASE_URL}/orders?orderId=${orderId}&status=${status}&note=${note}`,
      {},
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
  getAllOrders,
  getAllOrdersByCustomer,
  getOrderInfoOfCustomer,
  getOrder,
  addOrder,
  updateOrder,
};
