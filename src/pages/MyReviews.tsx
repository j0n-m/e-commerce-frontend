import { useSuspenseQuery } from "@tanstack/react-query";
import { reviewsByCustomerQueryOption } from "../routes/account/myreviews";
import useAuth from "../hooks/useAuth";
import { ReviewType2 } from "../types/ReviewType";
import { Link, useLoaderDeps } from "@tanstack/react-router";
import { Fragment, useContext, useEffect, useState } from "react";
import ProductSortBySelectBox from "../components/ProductSortBySelectBox";
import { Section } from "react-aria-components";
import { ShopURLQuery } from "../routes/shop/category/$categoryId";
import { queryClient } from "../App";
import { AxiosResponse } from "axios";
import { PaginationBar } from "../components/PaginationBar";
import { PaginationResponse } from "../types/ProductType";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import SortBoxListItem from "../components/SortBoxListItem";
import { Helmet } from "react-helmet-async";
import { calculateStars } from "../components/ProductCard";
import { trimString } from "../utilities/trimString";

const reviewsSortItems = [
  {
    name: "Newest",
    id: "1",
    href: "." as const,
    deps: { search: { page: 1 } } as const,
  },
  {
    name: "Oldest",
    id: "2",
    href: "." as const,
    deps: { search: { page: 1, sort: "oldest" } } as const,
  },
  {
    name: "Highest Rating",
    id: "3",
    href: "." as const,
    deps: { search: { sort: "highest_rating", page: 1 } } as const,
  },
  {
    name: "Lowest Rating",
    id: "4",
    href: "." as const,
    deps: { search: { sort: "lowest_rating", page: 1 } } as const,
  },
];
function useCustomerReviews({
  customerId,
  deps,
}: {
  customerId: string;
  deps: ShopURLQuery;
}) {
  const customerReviewsRes = useSuspenseQuery(
    reviewsByCustomerQueryOption({ customerId, deps })
  ).data;
  const customerReviews = customerReviewsRes.data.reviews as ReviewType2[];
  const customerReviewsResponse = customerReviewsRes.data as PaginationResponse;
  return { customerReviews, customerReviewsResponse };
}

function MyReviews() {
  const deps = useLoaderDeps({ from: "/account/myreviews/" });
  const { user } = useAuth();
  const { isTablet } = useContext(ScreenSizeContext);
  const authcache = (queryClient.getQueryData(["auth"]) as AxiosResponse).data
    .user?.id;
  const { customerReviews, customerReviewsResponse } = useCustomerReviews({
    customerId: user?.id || authcache || "",
    deps,
  });
  const [showSortBySelectBox, setShowSortBySelectBox] = useState(false);
  // (customerReviews);
  const reviewsSortMap = new Map([
    ["newest", "1"],
    ["oldest", "2"],
    ["highest_rating", "3"],
    ["lowest_rating", "4"],
  ]);
  const sortURL = new URLSearchParams(window.location.search).get("sort");
  useEffect(() => {
    const overlay = document.getElementById("select-box-overlay");
    if (showSortBySelectBox) {
      overlay?.classList.add("show");
    } else {
      setTimeout(() => {
        overlay?.classList.remove("show");
      }, 200);
    }
  }, [showSortBySelectBox]);

  return (
    <>
      <main className="flex-1 py-4 px-2 lg:px-4">
        <Helmet>
          <title>Cyber Den: My Reviews</title>
        </Helmet>
        <div className="lg:max-w-[1000px] lg:mx-auto">
          <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
            My Reviews
          </h1>
          {customerReviews.length > 0 && (
            <div className="filters dark:bg-amenusd p-2 rounded-md mb-2 relative">
              <ProductSortBySelectBox
                isOpen={showSortBySelectBox}
                onOpenChange={setShowSortBySelectBox}
                items={reviewsSortItems}
                selectedKey={reviewsSortMap.get(sortURL || "") || "1"}
                label="Sort By "
              >
                <Section className="flex flex-col">
                  {reviewsSortItems.map((option) => {
                    return (
                      <SortBoxListItem
                        text={option.name}
                        key={option.id}
                        props={{
                          textValue: option.name,
                          id: option.id,
                          href: option.href,
                          routerOptions: option.deps,
                        }}
                      />
                    );
                  })}
                </Section>
              </ProductSortBySelectBox>
            </div>
          )}
          <div className="divider dark:bg-a2sd bg-a2s mb-2"></div>

          <div className="customer-reviews border border-b-0 dark:border-a2sd">
            {customerReviews.length > 0 ? (
              customerReviews.map((review) => (
                <Fragment key={review._id}>
                  <div className="review-card rounded-md px-4 py-10 flex flex-col lg:flex-row">
                    <div className="review-content lg:flex-1">
                      <div className="product">
                        <Link
                          to="/shop/product/$productId"
                          params={{ productId: review.product_id._id }}
                          className="block w-max hover:underline focus-visible:underline"
                        >
                          <p className="text-a1 dark:text-a1d lg:hidden">
                            {trimString(review.product_id.name, 50)}
                          </p>
                          <p className="text-a1 dark:text-a1d hidden lg:block">
                            {trimString(review.product_id.name, 80)}
                          </p>
                        </Link>
                      </div>
                      <div className="star-rating flex mt-3">
                        {calculateStars(review.rating).stars}
                        <div className="ml-2"> {review.rating} of 5</div>
                      </div>
                      <div className="review-title mt-4">
                        <Link
                          to="/shop/review/$reviewId"
                          params={{ reviewId: review._id }}
                          className="block w-max hover:underline focus-visible:underline"
                        >
                          <p className="font-bold">{review.review_title}</p>
                        </Link>
                      </div>
                      <div className="review-desc mt-3">
                        <p className="text-a1 dark:text-a1d">
                          {trimString(review.review_description, 250)}
                        </p>
                      </div>
                    </div>
                    <div className="review-date mt-6 lg:-order-1 lg:w-[300px] lg:max-w-[300px]">
                      <p className="text-a1 dark:text-a1d">
                        {new Date(review.review_date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {review?.review_edit_date && (
                        <p className="text-a1 dark:text-a1d">
                          Edited on{" "}
                          {new Date(review.review_edit_date).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-b dark:border-b-a2sd"></div>
                </Fragment>
              ))
            ) : (
              <p className="p-2 border-b dark:border-b-a2sd">
                You have no product reviews.
              </p>
            )}
          </div>
        </div>

        <div id="select-box-overlay" className="select-box-overlay"></div>
      </main>
      <PaginationBar
        className="flex justify-center mt-3"
        totalPages={customerReviewsResponse.total_pages}
        currentPage={deps.page}
        searchDeps={deps}
        isLargeScreenSize={isTablet}
      />
    </>
  );
}

export default MyReviews;
