export type ProductType = [
  {
    _id: string;
    name: string;
    brand: string;
    price: number;
    retail_price: number;
    description: string;
    highlights: Highlight[];
    quantity: number;
    category: Category[];
    total_bought: number;
    tags: string[];
    image_src: string;
    discount?: number;
  },
];
export type ProductType2 = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  retail_price: number;
  description: string;
  highlights: Highlight[];
  quantity: number;
  category: Category[];
  total_bought: number;
  tags: string[];
  image_src: string;
  discount?: number;
};

export type Category = {
  alias: string;
  _id: string;
  name: string;
};
export type Highlight = {
  heading: string;
  overview: string;
};

export function isProduct(product: unknown): product is ProductType {
  return (product as ProductType)[0]._id !== undefined;
}

export type ProductResponse = {
  list_count: number;
  records_count: number;
  total_pages: number;
  products: ProductType[];
  review_info: ReviewInfoType[];
};

export type ReviewInfoType = {
  _id: string;
  rating_average: number;
  rating_highest: number;
  rating_lowest: number;
  rating_count: number;
  review_ids: string[];
};
