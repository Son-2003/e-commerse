import axios from "axios";
import {
  ProductResponse,
  SearchProductRequest,
} from "../common/models/product";
import { ResponseEntityPagination } from "common/models/pagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAllProducts = async (
  pageNo: number,
  pageSize: number,
  sortBy: string,
  sortDir: string,
  request: SearchProductRequest
): Promise<ResponseEntityPagination<ProductResponse>> => {
  const response = await axios.post<ResponseEntityPagination<ProductResponse>>(
    `${API_BASE_URL}/products/search?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`,
    request
  );
  return response.data;
};

const getProduct = async (id: number): Promise<ProductResponse> => {
  const response = await axios.get<ProductResponse>(
    `${API_BASE_URL}/products/${id}`
  );
  return response.data;
};

export default {
  getAllProducts,
  getProduct,
};
