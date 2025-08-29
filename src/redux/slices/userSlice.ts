import { deleteUserThunk, getAllUsersThunk, getNumberOfCustomersInSystemThunk, getUserDetailThunk, updateInfoThunk } from "@redux/thunk/userThunk";
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ResponseEntityPagination } from "common/models/pagination";
import { UserResponse } from "common/models/user";

interface UserState {
  users: ResponseEntityPagination<UserResponse>;
  userDetail: UserResponse | null;
  userUpdated: UserResponse | null;
  userDeleted: UserResponse | null;
  numberOfCustomer: number | null;
  loadingUser: boolean;
  errorUser: string | null;
}

const initialState: UserState = {
  users: {
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    last: false,
    content: [],
  },
  userDetail: null,
  userUpdated: null,
  userDeleted: null,
  numberOfCustomer: 0,
  loadingUser: false,
  errorUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getAllUsers(builder);
    getUserDetail(builder);
    updateInfo(builder)
    deleteUser(builder)
    getNumberOfCustomersInSystem(builder)
  },
});

function getAllUsers(builder: ActionReducerMapBuilder<UserState>) {
  builder
    .addCase(getAllUsersThunk.pending, (state) => {
      state.loadingUser = true;
      state.errorUser = null;
    })
    .addCase(
      getAllUsersThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<UserResponse>>
      ) => {
        state.loadingUser = false;
        state.users = action.payload;
      }
    )
    .addCase(
      getAllUsersThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingUser = false;
        state.errorUser = action.payload || "Get all users failed";
      }
    );
}

function getUserDetail(builder: ActionReducerMapBuilder<UserState>) {
  builder
    .addCase(getUserDetailThunk.pending, (state) => {
      state.loadingUser = true;
      state.errorUser = null;
    })
    .addCase(
      getUserDetailThunk.fulfilled,
      (state, action: PayloadAction<UserResponse>) => {
        state.loadingUser = false;
        state.userDetail = action.payload;
      }
    )
    .addCase(getUserDetailThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingUser = false;
      state.errorUser = action.payload || "Get user detail failed";
    });
}

function updateInfo(builder: ActionReducerMapBuilder<UserState>) {
  builder
    .addCase(updateInfoThunk.pending, (state) => {
      state.loadingUser = true;
      state.errorUser = null;
    })
    .addCase(
      updateInfoThunk.fulfilled,
      (state, action: PayloadAction<UserResponse>) => {
        state.loadingUser = false;
        state.userUpdated = action.payload;
      }
    )
    .addCase(updateInfoThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingUser = false;
      state.errorUser = action.payload || "Update user info failed";
    });
}

function deleteUser(builder: ActionReducerMapBuilder<UserState>) {
  builder
    .addCase(deleteUserThunk.pending, (state) => {
      state.loadingUser = true;
      state.errorUser = null;
    })
    .addCase(
      deleteUserThunk.fulfilled,
      (state, action: PayloadAction<UserResponse>) => {
        state.loadingUser = false;
        state.userDeleted = action.payload;
      }
    )
    .addCase(deleteUserThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingUser = false;
      state.errorUser = action.payload || "Delete user info failed";
    });
}

function getNumberOfCustomersInSystem(builder: ActionReducerMapBuilder<UserState>) {
  builder
    .addCase(getNumberOfCustomersInSystemThunk.pending, (state) => {
      state.loadingUser = true;
      state.errorUser = null;
    })
    .addCase(
      getNumberOfCustomersInSystemThunk.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loadingUser = false;
        state.numberOfCustomer = action.payload;
      }
    )
    .addCase(getNumberOfCustomersInSystemThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingUser = false;
      state.errorUser = action.payload || "Get number of customer in system failed";
    });
}

export default userSlice.reducer;
