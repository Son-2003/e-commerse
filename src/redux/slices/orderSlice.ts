import {
  addOrderThunk,
  getAllOrdersByCustomerThunk,
  getAllOrdersThunk,
  getOrderThunk,
  updateOrderThunk,
} from "@redux/thunk/orderThunk";
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { OrderResponse } from "common/models/order";
import { ResponseEntityPagination } from "common/models/pagination";

interface OrderState {
  orders: ResponseEntityPagination<OrderResponse>;
  orderDetail: OrderResponse | null;
  orderAdded: OrderResponse | null;
  orderUpdated: OrderResponse | null;
  loadingOrder: boolean;
  errorOrder: string | null;
}

const initialState: OrderState = {
  orders: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    last: false,
    content: [],
  },
  orderDetail: null,
  orderAdded: null,
  orderUpdated: null,
  loadingOrder: false,
  errorOrder: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderAdded = null;
      state.orderDetail = null;
    },
  },
  extraReducers: (builder) => {
    getAllOrders(builder);
    getAllOrdersByCustomer(builder);
    getOrder(builder);
    updateOrder(builder);
    addOrder(builder);
  },
});

function getAllOrders(builder: ActionReducerMapBuilder<OrderState>) {
  builder
    .addCase(getAllOrdersThunk.pending, (state) => {
      state.loadingOrder = true;
      state.errorOrder = null;
    })
    .addCase(
      getAllOrdersThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<OrderResponse>>
      ) => {
        state.loadingOrder = false;
        state.orders = action.payload;
      }
    )
    .addCase(
      getAllOrdersThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingOrder = false;
        state.errorOrder = action.payload || "get all orders failed";
      }
    );
}

function getAllOrdersByCustomer(builder: ActionReducerMapBuilder<OrderState>) {
  builder
    .addCase(getAllOrdersByCustomerThunk.pending, (state) => {
      state.loadingOrder = true;
      state.errorOrder = null;
    })
    .addCase(
      getAllOrdersByCustomerThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<OrderResponse>>
      ) => {
        state.loadingOrder = false;
        state.orders = action.payload;
      }
    )
    .addCase(
      getAllOrdersByCustomerThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingOrder = false;
        state.errorOrder =
          action.payload || "get all orders of customer failed";
      }
    );
}

function getOrder(builder: ActionReducerMapBuilder<OrderState>) {
  builder
    .addCase(getOrderThunk.pending, (state) => {
      state.loadingOrder = true;
      state.errorOrder = null;
    })
    .addCase(
      getOrderThunk.fulfilled,
      (state, action: PayloadAction<OrderResponse>) => {
        state.loadingOrder = false;
        state.orderDetail = action.payload;
      }
    )
    .addCase(getOrderThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingOrder = false;
      state.errorOrder = action.payload || "get order detail failed";
    });
}

function addOrder(builder: ActionReducerMapBuilder<OrderState>) {
  builder
    .addCase(addOrderThunk.pending, (state) => {
      state.loadingOrder = true;
      state.errorOrder = null;
    })
    .addCase(
      addOrderThunk.fulfilled,
      (state, action: PayloadAction<OrderResponse>) => {
        state.loadingOrder = false;
        state.orderAdded = action.payload;
      }
    )
    .addCase(addOrderThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingOrder = false;
      state.errorOrder = action.payload || "add order failed";
    });
}

function updateOrder(builder: ActionReducerMapBuilder<OrderState>) {
  builder
    .addCase(updateOrderThunk.pending, (state) => {
      state.loadingOrder = true;
      state.errorOrder = null;
    })
    .addCase(
      updateOrderThunk.fulfilled,
      (state, action: PayloadAction<OrderResponse>) => {
        state.loadingOrder = false;
        state.orderUpdated = action.payload;
      }
    )
    .addCase(updateOrderThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingOrder = false;
      state.errorOrder = action.payload || "update order failed";
    });
}

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
