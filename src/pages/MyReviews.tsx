import { useSuspenseQuery } from "@tanstack/react-query";
import { reviewsByCustomerQueryOption } from "../routes/account/myreviews";
import useAuth from "../hooks/useAuth";
import { ReviewType2 } from "../types/ReviewType";
import { Link } from "@tanstack/react-router";

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

  return (
    <main className="p-4 max-w-[1000px] mx-auto">
      <p>tba</p>
      <h1 className="text-2xl font-bold">My Reviews</h1>
      <div className="customer-reviews">
        {customerReviews.length > 0 &&
          customerReviews.map((review) => (
            <div key={review._id} className="review-card border-b p-2">
              <div className="review-heading">review ID:{review._id}</div>
              <div className="review-content">
                <p>product: {review.product_id.name}</p>
              </div>
              <Link
                className="hover:underline dark:text-green-400 text-green-700"
                to={`/shop/review/${review._id}`}
              >
                View details
              </Link>
            </div>
          ))}
      </div>
    </main>
  );
}

export default MyReviews;
