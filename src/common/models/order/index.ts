import { OrderStatus } from "common/enums/OrderStatus";
import { ProductResponse } from "../product";
import { PaymentHistoryResponse } from "../payment";
import { FeedbackResponse } from "../feedback";
import { UserResponse } from "../user";
import { PaymentType } from "common/enums/PaymentType";

export interface CartItem {
  id: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
  size: string;
}

export interface OrderDetailResponse {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: ProductResponse;
}

export interface OrderRequest {
  cartItems: CartItem[];
  address: string;
  fullName: string;
  email: string;
  phone: string;
  type: PaymentType;
}

export interface OrderResponse {
  id: number;
  orderCode: number;
  createdDate: Date;
  status: OrderStatus;
  isFeedback: boolean;
  totalAmount: number;
  address: string;
  user: UserResponse;
  paymentHistory: PaymentHistoryResponse;
  feedback: FeedbackResponse;
  orderDetails: OrderDetailResponse[];
}

export interface SearchOrderRequest {
  dateFrom?: Date;
  dateTo?: Date;
  statuses?: OrderStatus[];
  searchText?: string;
}

export interface OrderInfo {
  numberOfOrder: number;
  totalPrice: number;
}
