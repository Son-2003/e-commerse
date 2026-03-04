import { filterProductsThunk, getAllProductsThunk, getProductThunk } from "@redux/thunk/productThunk";
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ResponseEntityPagination } from "common/models/pagination";
import { ProductResponse } from "common/models/product";

interface ProductState {
  products: ResponseEntityPagination<ProductResponse>;
  filterProducts: ResponseEntityPagination<ProductResponse>;
  productDetail: ProductResponse | null;
  loadingProduct: boolean;
  errorProduct: string | null;
}

const initialState: ProductState = {
  products: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    last: false,
    content: [],
  },
  filterProducts: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    last: false,
    content: [],
  },
  productDetail: null,
  loadingProduct: false,
  errorProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getAllProducts(builder);
    filterProducts(builder)
    getProduct(builder);
  },
});

function getAllProducts(builder: ActionReducerMapBuilder<ProductState>) {
  builder
    .addCase(getAllProductsThunk.pending, (state) => {
      state.loadingProduct = true;
      state.errorProduct = null;
    })
    .addCase(
      getAllProductsThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<ProductResponse>>
      ) => {
        state.loadingProduct = false;
        state.products = action.payload;
      }
    )
    .addCase(
      getAllProductsThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingProduct = false;
        state.errorProduct = action.payload || "Get all products failed";
      }
    );
}

function filterProducts(builder: ActionReducerMapBuilder<ProductState>) {
  builder
    .addCase(filterProductsThunk.pending, (state) => {
      state.loadingProduct = true;
      state.errorProduct = null;
    })
    .addCase(
      filterProductsThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<ProductResponse>>
      ) => {
        state.loadingProduct = false;
        state.filterProducts = action.payload;
      }
    )
    .addCase(
      filterProductsThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingProduct = false;
        state.errorProduct = action.payload || "Filter products failed";
      }
    );
}

function getProduct(builder: ActionReducerMapBuilder<ProductState>) {
  builder
    .addCase(getProductThunk.pending, (state) => {
      state.loadingProduct = true;
      state.errorProduct = null;
    })
    .addCase(
      getProductThunk.fulfilled,
      (
        state,
        action: PayloadAction<ProductResponse>
      ) => {
        state.loadingProduct = false;
        state.productDetail = action.payload;
      }
    )
    .addCase(
      getProductThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingProduct = false;
        state.errorProduct = action.payload || "Get product detail failed";
      }
    );
}

export default productSlice.reducer;
