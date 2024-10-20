import { useSuspenseQuery } from "@tanstack/react-query";
import { reviewsByCustomerQueryOption } from "../routes/account/myreviews";
import useAuth from "../hooks/useAuth";
import { ReviewType2 } from "../types/ReviewType";
import { Link } from "@tanstack/react-router";
import { calculateStars } from "../components/ProductCard";

function useCustomerReviews({
  userId,
  page = 1,
}: {
  userId: string;
  page?: number;
}) {
  const customerReviewsRes = useSuspenseQuery(
    reviewsByCustomerQueryOption({ userId, page })
  ).data;
  const customerReviews = customerReviewsRes.data.reviews as ReviewType2[];
  return { customerReviews };
}

function MyReviews() {
  const { user } = useAuth();
  const { customerReviews } = useCustomerReviews({ userId: user?.id || "" });
  console.log(customerReviews);

  return (
    <main className="flex-1 py-4 px-2 lg:px-4">
      <h1 className="font-bold text-xl pb-2">My Reviews</h1>
      <div className="filters dark:bg-amenusd p-2 rounded-md mb-2 relative"></div>
      <div className="divider bg-a2sd mb-2"></div>
      <div className="customer-reviews lg:max-w-[1000px] lg:mx-auto">
        {customerReviews.length > 0 &&
          customerReviews.map((review) => (
            <div
              key={review._id}
              className="review-card mb-4 border dark:border-a2sd rounded-md"
            >
              <div className="review-content p-2">
                <p>Product: {review.product_id.name}</p>
                <p>
                  Review Date: {new Date(review.review_date).toDateString()}
                </p>
                <p>Rating: {review.rating}/5</p>
              </div>
              <div className="bg-a2sd px-2 py-1 text-sm">
                <Link
                  className="hover:underline dark:text-green-400 text-green-700"
                  to={`/shop/review/${review._id}`}
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default MyReviews;
