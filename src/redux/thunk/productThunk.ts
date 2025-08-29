import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseEntityPagination } from "common/models/pagination";
import { ProductResponse, SearchProductRequest } from "common/models/product";
import ProductService from "services/ProductService";

export const getAllProductsThunk = createAsyncThunk<
  ResponseEntityPagination<ProductResponse>,
  { pageNo: number; pageSize: number; sortBy: string; sortDir: string, request: SearchProductRequest }
>(
  "product/getAllProductsThunk",
  async ({ pageNo, pageSize, sortBy, sortDir, request }, thunkAPI) => {
    try {
      const data = await ProductService.getAllProducts(
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        request
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "get all products failed"
      );
    }
  }
);

export const getProductThunk = createAsyncThunk<ProductResponse, number>(
  "product/getProduct",
  async (id, thunkAPI) => {
    try {
      const data = await ProductService.getProduct(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "get product detail failed"
      );
    }
  }
);
