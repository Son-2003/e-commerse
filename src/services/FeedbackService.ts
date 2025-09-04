import axios from "axios";
import {
  FeedbackRequest,
  FeedbackResponse,
  FeedbackSummaryResponse,
  SearchFeedbackRequest,
} from "common/models/feedback";
import { ResponseEntityPagination } from "common/models/pagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAllFeedbacks = async (
  pageNo: number,
  pageSize: number,
  sortBy: string,
  sortDir: string,
  request: SearchFeedbackRequest
): Promise<ResponseEntityPagination<FeedbackResponse>> => {
  try {
    const response = await axios.post<ResponseEntityPagination<FeedbackResponse>>(
      `${API_BASE_URL}/feedbacks/search?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`,
      request,
      {}
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const getSummaryFeedback = async (
  request: SearchFeedbackRequest
): Promise<FeedbackSummaryResponse> => {
  try {
    const response = await axios.post<FeedbackSummaryResponse>(
      `${API_BASE_URL}/feedbacks/summary`,
      request,
      {}
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const getAllFeedbacksOfOrder = async (
  accessToken: string,
  orderId: number
): Promise<FeedbackResponse[]> => {
  try {
    const response = await axios.get<FeedbackResponse[]>(
      `${API_BASE_URL}/feedbacks/order/${orderId}`,
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

const createFeedback = async (
  accessToken: string,
  orderId: number,
  requests: FeedbackRequest[]
): Promise<FeedbackResponse[]> => {
  try {
    const response = await axios.post<FeedbackResponse[]>(
      `${API_BASE_URL}/feedbacks?orderId=${orderId}`,
      requests,
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

const updateFeedback = async (
  accessToken: string,
  request: FeedbackRequest
): Promise<FeedbackResponse> => {
  try {
    const response = await axios.put<FeedbackResponse>(
      `${API_BASE_URL}/feedbacks`,
      {
        request,
      },
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

const deleteFeedback = async (
  accessToken: string,
  id: number
): Promise<FeedbackResponse> => {
  try {
    const response = await axios.put<FeedbackResponse>(
      `${API_BASE_URL}/feedbacks?id=${id}`,
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
  getAllFeedbacks,
  getAllFeedbacksOfOrder,
  getSummaryFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
