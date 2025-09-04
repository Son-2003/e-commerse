import { PaymentStatus } from "common/enums/PaymentStatus copy";
import { PaymentType } from "common/enums/PaymentType";
import { CartItem } from "../order";

export interface PaymentHistoryResponse {
  id: number;
  amount: number;
  createdDate: Date;
  status: PaymentStatus;
  type: PaymentType;
}

export interface CreatePaymentRequest {
  cartItems: CartItem[];
  orderCode: number;
  returnUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponseData {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  expiredAt?: number;
  checkoutUrl: string;
  qrCode: string;
}
