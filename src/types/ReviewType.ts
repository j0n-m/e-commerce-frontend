export type ReviewType = {
  rating: 1 | 2 | 3 | 4 | 5;
  reviewer_name: string;
  review_description: string;
  review_date: Date;
  review_edit_date?: Date;
  product_id: string;
};
