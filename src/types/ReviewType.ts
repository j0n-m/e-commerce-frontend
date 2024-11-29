import { ProductType } from "./ProductType";

export type ReviewType = {
  _id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewer_name: string;
  review_description: string;
  review_date: Date;
  review_edit_date?: Date;
  review_title: string;
  product_id: ProductType;
  reviewer: Reviewer;
};
export type ReviewType2 = {
  _id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewer_name: string;
  review_description: string;
  review_date: Date;
  review_edit_date?: Date;
  review_title: string;
  product_id: ProductType;
  reviewer: Reviewer;
};
export type ReviewType3 = {
  _id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewer_name: string;
  review_description: string;
  review_date: Date;
  review_edit_date?: Date;
  review_title: string;
  product_id: ProductType;
  reviewer: Reviewer2;
};
type Reviewer = {
  _id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};
type Reviewer2 = Pick<
  Reviewer,
  "_id" | "username" | "first_name" | "last_name"
>[];
export type RatingInfo = {
  rating_average: number;
  rating_highest: number;
  rating_lowest: number;
  rating_count: number;
};

export type SingleProductReview = {
  reviews: ReviewType3[];
  list_count: number;
  records_count: number;
  total_pages: number;
  rating_info: RatingInfo[];
};
