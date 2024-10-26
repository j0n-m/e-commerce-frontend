import { useLoaderDeps } from "@tanstack/react-router";
import { ShopURLQuery } from "../routes/shop/category/$categoryId";
import { useSuspenseQuery } from "@tanstack/react-query";
import { bestDealsQueryOption } from "../routes/shop/category/best-deals";
import { BestSellersResponse, PaginationResponse } from "../types/ProductType";
import { Section } from "react-aria-components";
import ProductCard_Category from "../components/ProductCard_Category";
import { useEffect, useState } from "react";
import ProductSortBySelectBox from "../components/ProductSortBySelectBox";
import SortBoxListItem from "../components/SortBoxListItem";

const useBestDeals = ({ deps }: { deps: Partial<ShopURLQuery> }) => {
  const responseData = useSuspenseQuery(bestDealsQueryOption({ deps })).data;
  const bestDeals = responseData.data as BestSellersResponse &
    PaginationResponse;
  return { bestDeals };
};
export const productSortByOptionValues = [
  {
    name: "Best Deal",
    id: "1",
    href: "/shop/category/best-deals" as const,
    deps: { search: { page: 1 } } as const,
  },
  {
    name: "Best Rating",
    id: "2",
    href: "." as const,
    deps: { search: { sortBy: "best_rating", page: 1 } } as const,
  },
  {
    name: "Most Reviews",
    id: "3",
    href: "." as const,
    deps: { search: { sortBy: "most_reviews", page: 1 } } as const,
  },
  {
    name: "Highest Price",
    id: "4",
    href: "." as const,
    deps: { search: { sortBy: "highest_price", page: 1 } } as const,
  },
  {
    name: "Lowest Price",
    id: "5",
    href: "." as const,
    deps: { search: { sortBy: "lowest_price", page: 1 } } as const,
  },
];
function BestDeals() {
  const deps = useLoaderDeps({ from: "/shop/category/best-deals" });
  const { bestDeals } = useBestDeals({ deps });
  const [openSelectBox, setOpenSelectBox] = useState(false);

  const reviews = bestDeals.review_info.map((r) => ({
    _id: r._id,
    rating_average: r.rating_average,
    rating_count: r.rating_count,
  }));

  const reviewMap = new Map(
    reviews.map((review) => [review._id, review.rating_average])
  );
  const reviewTotalCountMap = new Map(
    reviews.map((review) => [review._id, review.rating_count])
  );
  const sortByMap = new Map([
    ["best_deal", "1"],
    ["best_rating", "2"],
    ["most_reviews", "3"],
    ["highest_price", "4"],
    ["lowest_price", "5"],
  ]);
  const sortByName = new URLSearchParams(window.location.search).get("sortBy");
  useEffect(() => {
    const overlay = document.getElementById("select-box-overlay");
    if (openSelectBox) {
      overlay?.classList.add("show");
    } else {
      setTimeout(() => {
        overlay?.classList.remove("show");
      }, 200);
    }
  }, [openSelectBox]);

  return (
    <main className="flex-1 py-4 px-2 lg:px-4">
      <h1 className="font-bold text-xl pb-2">Today's Best Deals</h1>
      <div className="filters dark:bg-amenusd p-2 rounded-md mb-2 relative">
        <ProductSortBySelectBox
          items={productSortByOptionValues}
          label="Sort By"
          isOpen={openSelectBox}
          onOpenChange={setOpenSelectBox}
          selectedKey={sortByMap.get(sortByName || "") || "1"}
        >
          <Section className="flex flex-col">
            {productSortByOptionValues.map((option) => {
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
        {/* <ListBoxItem
                id={1}
                href="/shop/category/best-deals"
                routerOptions={{ search: { page: 1 } }}
              >
                Best Deal
              </ListBoxItem>
              <ListBoxItem

                href="."
                routerOptions={{ search: { sortBy: "lowest_price", page: 1 } }}
              >
                Lowest Price
              </ListBoxItem>
              <ListBoxItem
                href="."
                routerOptions={{ search: { sortBy: "highest_price", page: 1 } }}
              >
                Highest Price
              </ListBoxItem>
              <ListBoxItem
                href="."
                routerOptions={{ search: { sortBy: "best_rating", page: 1 } }}
              >
                Best Rating
              </ListBoxItem>
              <ListBoxItem
                href="."
                routerOptions={{ search: { sortBy: "most_reviews", page: 1 } }}
              >
                Most Reviews
              </ListBoxItem> */}
      </div>
      <div className="divider dark:bg-a2sd bg-a2s mb-2"></div>
      <div className="products flex flex-col lg:flex-row lg:flex-wrap lg:gap-3">
        {bestDeals.records_count > 0 ? (
          bestDeals.products.map((product) => {
            if ((product.discount as number) <= 0) return;
            return (
              <ProductCard_Category
                key={product._id}
                product={product}
                reviewIdMap={reviewMap}
                reviewTotalCountMap={reviewTotalCountMap}
              />
            );
          })
        ) : (
          <div>No products to list.</div>
        )}
      </div>
      <div id="select-box-overlay" className="select-box-overlay"></div>
    </main>
  );
}

export default BestDeals;
