import {
  addOrderThunk,
  getAllOrdersByCustomerThunk,
  getAllOrdersThunk,
  getOrderInfoOfCustomerThunk,
  getOrderThunk,
  updateOrderThunk,
} from "@redux/thunk/orderThunk";
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { OrderInfo, OrderResponse } from "common/models/order";
import { ResponseEntityPagination } from "common/models/pagination";

interface OrderState {
  orders: ResponseEntityPagination<OrderResponse>;
  orderDetail: OrderResponse | null;
  orderAdded: OrderResponse | null;
  orderUpdated: OrderResponse | null;
  orderInfo: OrderInfo | null;
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
  orderInfo: null,
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

    setOrderAddedSuccess: (state, action: PayloadAction<OrderResponse>) => {
      state.orderAdded = action.payload;
    },
  },
  extraReducers: (builder) => {
    getAllOrders(builder);
    getAllOrdersByCustomer(builder);
    getOrder(builder);
    getOrderInfoOfCustomer(builder);
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

function getOrderInfoOfCustomer(builder: ActionReducerMapBuilder<OrderState>) {
  builder
    .addCase(getOrderInfoOfCustomerThunk.pending, (state) => {
      state.loadingOrder = true;
      state.errorOrder = null;
    })
    .addCase(
      getOrderInfoOfCustomerThunk.fulfilled,
      (state, action: PayloadAction<OrderInfo>) => {
        state.loadingOrder = false;
        state.orderInfo = action.payload;
      }
    )
    .addCase(
      getOrderInfoOfCustomerThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingOrder = false;
        state.errorOrder = action.payload || "get order info detail failed";
      }
    );
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

export const { resetOrder, setOrderAddedSuccess } = orderSlice.actions;
export default orderSlice.reducer;
