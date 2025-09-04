import axios from "axios";
import { CheckoutResponseData, CreatePaymentRequest } from "common/models/payment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const createPaymentLink = async (
  accessToken?: string | null,
  request?: CreatePaymentRequest
): Promise<CheckoutResponseData> => {
  try {
    const headers: Record<string, string> = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.post<CheckoutResponseData>(
      `${API_BASE_URL}/payments/link`,
      request,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default {
  createPaymentLink,
};
