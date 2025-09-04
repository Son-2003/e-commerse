import { EntityStatus } from "common/enums/EntityStatus";
import { UserResponse } from "../user";
import { ProductResponse } from "../product";
import { ResponseEntityPagination } from "../pagination";

export interface FeedbackRequest {
  id: number;
  comment: string;
  rating: number;
  image: string;
  productId: number;
}

export interface FeedbackResponse {
  id: number;
  rating: number;
  quantity: number;
  totalPrice: number;
  comment: string;
  image: string;
  createdDate: Date;
  status: EntityStatus;
  user: UserResponse;
  product: ProductResponse;
}

export interface SearchFeedbackRequest {
  productId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  statuses?: EntityStatus[];
  rating?: number;
  searchText?: string;
}

export interface FeedbackSummaryResponse {
  averageRating: number;
  totalFeedback: number;
  oneStarCount: number;
  twoStarCount: number;
  threeStarCount: number;
  fourStarCount: number;
  fiveStarCount: number;
}
