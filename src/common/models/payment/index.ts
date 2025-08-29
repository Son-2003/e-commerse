import { PaymentStatus } from "common/enums/PaymentStatus copy";
import { PaymentType } from "common/enums/PaymentType";

export interface PaymentHistoryResponse {
  id: number;
  amount: number;
  createdDate: Date;
  status: PaymentStatus;
  type: PaymentType;
}