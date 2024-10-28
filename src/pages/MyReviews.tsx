import { useSuspenseQuery } from "@tanstack/react-query";
import { reviewsByCustomerQueryOption } from "../routes/account/myreviews";
import useAuth from "../hooks/useAuth";
import { ReviewType2 } from "../types/ReviewType";
import { Link, useLoaderDeps } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
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
          <div className="customer-reviews">
            {customerReviews.length > 0 ? (
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
                  <div className="dark:bg-a2sd bg-a1s px-2 py-1 text-sm">
                    <Link
                      className="hover:underline dark:text-green-400 text-green-600"
                      to={`/shop/review/${review._id}`}
                    >
                      View details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>You have no product reviews.</p>
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
