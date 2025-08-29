import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { JWTAuthResponse } from "../../common/models/auth";
import { UserResponse } from "common/models/user";
import {
  changePasswordThunk,
  getInfoThunk,
  logoutUserThunk,
  refreshTokenThunk,
  signInUserThunk,
  signUpCustomerThunk,
  signUpStaffThunk,
} from "@redux/thunk/authThunk";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserResponse | null;
  changePasswordSuccess: boolean | null;
  loadingAuth: boolean;
  errorAuth: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  changePasswordSuccess: null,
  loadingAuth: false,
  errorAuth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUserAuth: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    resetAuthError: (state) => {
      state.errorAuth = null;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.userInfo = null;
      state.changePasswordSuccess = null;
      state.loadingAuth = false;
      state.errorAuth = null;
    },
  },
  extraReducers: (builder) => {
    signInUser(builder);
    signUpCustomer(builder);
    signUpStaff(builder);
    getInfo(builder);
    logoutUser(builder);
    changePassword(builder);
    refreshToken(builder);
  },
});

function signInUser(builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(signInUserThunk.pending, (state) => {
      state.loadingAuth = true;
      state.errorAuth = null;
    })
    .addCase(
      signInUserThunk.fulfilled,
      (state, action: PayloadAction<JWTAuthResponse>) => {
        state.loadingAuth = false;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
      }
    )
    .addCase(signInUserThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingAuth = false;
      state.errorAuth = action.payload || "Sign in failed";
    });
}

function signUpCustomer(builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(signUpCustomerThunk.pending, (state) => {
      state.loadingAuth = true;
      state.errorAuth = null;
    })
    .addCase(
      signUpCustomerThunk.fulfilled,
      (state, action: PayloadAction<JWTAuthResponse>) => {
        state.loadingAuth = false;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
      }
    )
    .addCase(
      signUpCustomerThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingAuth = false;
        state.errorAuth = action.payload || "Sign up failed";
      }
    );
}

function signUpStaff(builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(signUpStaffThunk.pending, (state) => {
      state.loadingAuth = true;
      state.errorAuth = null;
    })
    .addCase(
      signUpStaffThunk.fulfilled,
      (state, action: PayloadAction<JWTAuthResponse>) => {
        state.loadingAuth = false;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
      }
    )
    .addCase(signUpStaffThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingAuth = false;
      state.errorAuth = action.payload || "Sign up failed";
    });
}

function getInfo(builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(getInfoThunk.pending, (state) => {
      state.loadingAuth = true;
      state.errorAuth = null;
    })
    .addCase(
      getInfoThunk.fulfilled,
      (state, action: PayloadAction<UserResponse>) => {
        state.loadingAuth = false;
        state.userInfo = action.payload;
      }
    )
    .addCase(getInfoThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingAuth = false;
      state.errorAuth = action.payload || "Get user info failed";
    });
}

function logoutUser(builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(logoutUserThunk.pending, (state) => {
      state.loadingAuth = true;
      state.errorAuth = null;
    })
    .addCase(logoutUserThunk.fulfilled, (state) => {
      state.loadingAuth = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.errorAuth = null;
    })
    .addCase(logoutUserThunk.rejected, (state, action: PayloadAction<any>) => {
      state.loadingAuth = false;
      state.errorAuth = action.payload || "Logout failed";
    });
}

function changePassword(builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(changePasswordThunk.pending, (state) => {
      state.loadingAuth = true;
      state.errorAuth = null;
      state.changePasswordSuccess = null;
    })
    .addCase(
      changePasswordThunk.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.loadingAuth = false;
        state.changePasswordSuccess = action.payload;
      }
    )
    .addCase(
      changePasswordThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingAuth = false;
        state.errorAuth = action.payload || "Change password failed";
        state.changePasswordSuccess = false;
      }
    );
}

function refreshToken(builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(refreshTokenThunk.pending, (state) => {
      state.loadingAuth = true;
      state.errorAuth = null;
    })
    .addCase(
      refreshTokenThunk.fulfilled,
      (state, action: PayloadAction<JWTAuthResponse>) => {
        state.loadingAuth = false;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
      }
    )
    .addCase(
      refreshTokenThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingAuth = false;
        state.errorAuth = action.payload || "Refresh token failed";
      }
    );
}

export const { logout, setTokens, resetUserAuth, resetAuthError } =
  authSlice.actions;
export default authSlice.reducer;
