export type ReviewType = {
  _id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewer_name: string;
  review_description: string;
  review_date: Date;
  review_edit_date?: Date;
  review_title: string;
  product_id: string;
};
export type RatingInfo = {
  rating_average: number;
  rating_highest: number;
  rating_lowest: number;
  rating_count: number;
};

export type SingleProductReview = {
  reviews: ReviewType[];
  list_count: number;
  records_count: number;
  total_pages: number;
  rating_info: RatingInfo[];
};
