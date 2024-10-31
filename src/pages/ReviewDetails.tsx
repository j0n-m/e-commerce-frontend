import { useReview } from "./EditReview";
import { getRouteApi, Link } from "@tanstack/react-router";
import useAuth from "../hooks/useAuth";
import { calculateStars } from "../components/ProductCard";
import noproductImage from "../assets/images/no_product_image.jpg";
const route = getRouteApi("/shop/review/$reviewId/");

function ReviewDetails() {
  const { user } = useAuth();
  const { reviewId } = route.useParams();
  const review = useReview({ reviewId });
  const { stars } = calculateStars(review.rating);
  return (
    <main className="p-4 flex-1">
      <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
        Customer Review
      </h1>
      <div className="card border p-4 pt-8 dark:border-a2sd rounded-lg">
        <div className="review-main flex flex-col lg:flex-row">
          <div className="review-details flex-1 px-4">
            <div className="product-name">
              <p className="font-bold">
                <Link
                  to="/shop/product/$productId"
                  params={{ productId: review.product_id._id }}
                  className="hover:underline focus-visible:underline active:underline"
                >
                  {review.product_id.name}
                </Link>
              </p>
            </div>
            <div className="reviewer mt-3">
              <p>{review.reviewer_name}</p>
            </div>
            <div className="review-stars mt-1">{stars}</div>
            <div className="review-title mt-3">
              <p className="font-bold">{review.review_title}</p>
            </div>
            <div className="review-desc mt-3">
              <p className="text-a1 dark:text-a1d">
                {review.review_description}
              </p>
            </div>
          </div>
          <div className="review-extra px-4 lg:px-0 lg:-order-1 lg:w-[220px] lg:max-w-[220px]">
            <div className="img-container hidden lg:block rounded-md">
              <img
                src={review.product_id.image_src || noproductImage}
                className="aspect-square w-[160px] object-contain rounded-md"
                alt={
                  review.product_id.image_src
                    ? review.product_id.name
                    : "No Product Image Available."
                }
              />
            </div>
            <div className="review-dates mt-6">
              <p className="text-a1 dark:text-a1d">
                {new Date(review.review_date).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {review?.review_edit_date && (
                <p className="mt-1 text-a1 dark:text-a1d">
                  Edited:{" "}
                  {new Date(review.review_edit_date).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center lg:justify-end lg:border-none border-t dark:border-t-a2sd mt-6 pt-4">
          {(user?.id || "") === review.reviewer._id && (
            <Link
              className="active:underline focus-visible:underline"
              to="/shop/review/$reviewId/edit"
              params={{ reviewId }}
              mask={{
                to: "/shop/review/$reviewId",
                params: { reviewId },
                unmaskOnReload: true,
              }}
            >
              <p className="">Edit this review</p>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

export default ReviewDetails;
