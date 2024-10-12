import React from "react";
import { useReview } from "./EditReview";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Link as LinkAria } from "react-aria-components";
import useAuth from "../hooks/useAuth";
import { calculateStars } from "../components/ProductCard";
import noproductImage from "../assets/images/no_product_image.jpg";
import { trimString } from "../utilities/trimString";
const route = getRouteApi("/shop/review/$reviewId/");

function ReviewDetails() {
  const { user } = useAuth();
  const { reviewId } = route.useParams();
  const review = useReview({ reviewId });
  console.log(review);
  const { stars } = calculateStars(review.rating);
  return (
    <main className="lg:w-[500px] lg:mx-auto p-4 flex-1">
      <div>
        <h1 className="text-2xl font-bold">Customer Review</h1>

        <div className="review-card dark:bg-a1d p-4 bg-neutral-100 rounded-md mt-2">
          <LinkAria
            href={`/shop/product/$productId`}
            routerOptions={{ params: { productId: review.product_id._id } }}
            className="group"
          >
            <div className="flex gap-2 mb-4">
              <img
                src={
                  review.product_id.image_src
                    ? review.product_id.image_src
                    : noproductImage
                }
                className="aspect-square max-h-[100px]"
                alt={
                  review.product_id.image_src
                    ? review.product_id.name
                    : "No image available"
                }
              />
              <div>
                <p className="group-data-[hovered]:underline">
                  {trimString(review.product_id.name)}
                </p>
                <p className="text-a1d">
                  ${review.product_id.price.toFixed(2)}
                </p>
              </div>
            </div>
          </LinkAria>
          <p>By: {review.reviewer_name}</p>
          <p>Rating: {review.rating} out of 5</p>
          <div>{stars}</div>
          <p className="text-sm dark:text-a1d">
            Last Reviewed on{" "}
            {review.review_edit_date
              ? new Date(review.review_edit_date).toDateString()
              : new Date(review.review_date).toDateString()}
          </p>

          <p className="mt-2 font-bold">{review.review_title}</p>
          <p className="">{review.review_description}</p>
          {(user?.id || "") === review.reviewer._id && (
            <Link
              className="dark:text-purple-400 text-purple-700"
              to="/shop/review/$reviewId/edit"
              params={{ reviewId }}
              mask={{
                to: "/shop/review/$reviewId",
                params: { reviewId },
                unmaskOnReload: true,
              }}
            >
              <p className="mt-2">Edit this review</p>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

export default ReviewDetails;
