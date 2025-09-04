import {
  createFeedbackThunk,
  deleteFeedbackThunk,
  getAllFeedbacksOfOrderThunk,
  getAllFeedbacksThunk,
  getSummaryFeedbackThunk,
  updateFeedbackThunk,
} from "@redux/thunk/feedbackThunk";
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  FeedbackResponse,
  FeedbackSummaryResponse,
} from "common/models/feedback";
import { ResponseEntityPagination } from "common/models/pagination";

interface FeedbackState {
  feedbacks: ResponseEntityPagination<FeedbackResponse> | null;
  feedbackSummary: FeedbackSummaryResponse | null;
  feedbackOfOrder: FeedbackResponse[] | null;
  feedbackCreated: FeedbackResponse[] | null;
  feedbackUpdated: FeedbackResponse | null;
  feedbackDeleted: FeedbackResponse | null;
  loadingFeedback: boolean;
  errorFeedback: string | null;
}

const initialState: FeedbackState = {
  feedbacks: {
    content: [],
    pageNo: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    last: true,
  },
  feedbackSummary: {
    averageRating: 0,
    totalFeedback: 0,
    oneStarCount: 0,
    twoStarCount: 0,
    threeStarCount: 0,
    fourStarCount: 0,
    fiveStarCount: 0,
  },
  feedbackCreated: null,
  feedbackOfOrder: null,
  feedbackDeleted: null,
  feedbackUpdated: null,
  loadingFeedback: false,
  errorFeedback: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    resetFeedback: (state) => {
      state.feedbackOfOrder = null;
      state.feedbackCreated = null;
      state.feedbackUpdated = null;
    },
  },
  extraReducers: (builder) => {
    getAllFeedbacks(builder);
    getAllFeedbacksOfOrder(builder);
    getSummaryFeedback(builder);
    createFeedback(builder);
    updateFeedback(builder);
    deleteFeedback(builder);
  },
});

function getAllFeedbacks(builder: ActionReducerMapBuilder<FeedbackState>) {
  builder
    .addCase(getAllFeedbacksThunk.pending, (state) => {
      state.loadingFeedback = true;
      state.errorFeedback = null;
    })
    .addCase(
      getAllFeedbacksThunk.fulfilled,
      (
        state,
        action: PayloadAction<ResponseEntityPagination<FeedbackResponse>>
      ) => {
        state.loadingFeedback = false;
        state.feedbacks = action.payload;
      }
    )
    .addCase(
      getAllFeedbacksThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingFeedback = false;
        state.errorFeedback = action.payload || "get all feedbacks failed";
      }
    );
}

function getSummaryFeedback(builder: ActionReducerMapBuilder<FeedbackState>) {
  builder
    .addCase(getSummaryFeedbackThunk.pending, (state) => {
      state.loadingFeedback = true;
      state.errorFeedback = null;
    })
    .addCase(
      getSummaryFeedbackThunk.fulfilled,
      (state, action: PayloadAction<FeedbackSummaryResponse>) => {
        state.loadingFeedback = false;
        state.feedbackSummary = action.payload;
      }
    )
    .addCase(
      getSummaryFeedbackThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingFeedback = false;
        state.errorFeedback = action.payload || "get summary feedbacks failed";
      }
    );
}

function getAllFeedbacksOfOrder(
  builder: ActionReducerMapBuilder<FeedbackState>
) {
  builder
    .addCase(getAllFeedbacksOfOrderThunk.pending, (state) => {
      state.loadingFeedback = true;
      state.errorFeedback = null;
    })
    .addCase(
      getAllFeedbacksOfOrderThunk.fulfilled,
      (state, action: PayloadAction<FeedbackResponse[]>) => {
        state.loadingFeedback = false;
        state.feedbackOfOrder = action.payload;
      }
    )
    .addCase(
      getAllFeedbacksOfOrderThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingFeedback = false;
        state.errorFeedback =
          action.payload || "get all feedbacks of order failed";
      }
    );
}

function createFeedback(builder: ActionReducerMapBuilder<FeedbackState>) {
  builder
    .addCase(createFeedbackThunk.pending, (state) => {
      state.loadingFeedback = true;
      state.errorFeedback = null;
    })
    .addCase(
      createFeedbackThunk.fulfilled,
      (state, action: PayloadAction<FeedbackResponse[]>) => {
        state.loadingFeedback = false;
        state.feedbackCreated = action.payload;
      }
    )
    .addCase(
      createFeedbackThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingFeedback = false;
        state.errorFeedback = action.payload || "create feedback failed";
      }
    );
}

function updateFeedback(builder: ActionReducerMapBuilder<FeedbackState>) {
  builder
    .addCase(updateFeedbackThunk.pending, (state) => {
      state.loadingFeedback = true;
      state.errorFeedback = null;
    })
    .addCase(
      updateFeedbackThunk.fulfilled,
      (state, action: PayloadAction<FeedbackResponse>) => {
        state.loadingFeedback = false;
        state.feedbackUpdated = action.payload;
      }
    )
    .addCase(
      updateFeedbackThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingFeedback = false;
        state.errorFeedback = action.payload || "update feedback failed";
      }
    );
}

function deleteFeedback(builder: ActionReducerMapBuilder<FeedbackState>) {
  builder
    .addCase(deleteFeedbackThunk.pending, (state) => {
      state.loadingFeedback = true;
      state.errorFeedback = null;
    })
    .addCase(
      deleteFeedbackThunk.fulfilled,
      (state, action: PayloadAction<FeedbackResponse>) => {
        state.loadingFeedback = false;
        state.feedbackDeleted = action.payload;
      }
    )
    .addCase(
      deleteFeedbackThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingFeedback = false;
        state.errorFeedback = action.payload || "delete order failed";
      }
    );
}

export const { resetFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
