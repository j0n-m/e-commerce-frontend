import { useLoaderDeps } from "@tanstack/react-router";
import { ShopURLQuery } from "../routes/shop/category/$categoryId";
import { useSuspenseQuery } from "@tanstack/react-query";
import { bestsellersQueryOptions } from "../routes/shop/category/best-sellers";
import { BestSellersResponse, PaginationResponse } from "../types/ProductType";
import ProductCard_Category from "../components/ProductCard_Category";
import { Section } from "react-aria-components";
import ProductSortBySelectBox from "../components/ProductSortBySelectBox";
import { productSortByOptionValues as sortByValues } from "./BestDeals";
import { useEffect, useState } from "react";
import SortBoxListItem from "../components/SortBoxListItem";

const filtered = sortByValues.filter((obj) => obj.href === ".");
const productSortByOptionValues = [
  {
    name: "Best Seller",
    id: "1",
    href: "/shop/category/best-sellers" as const,
    deps: {
      search: {
        page: 1,
      },
    } as const,
  },
  ...filtered,
];

function useBestSellers({ deps }: { deps: Partial<ShopURLQuery> }) {
  const bestsellersData = useSuspenseQuery(
    bestsellersQueryOptions({ deps })
  ).data;
  const bestSellers = bestsellersData.data as PaginationResponse &
    BestSellersResponse;
  return { bestSellers };
}
function BestSellers() {
  const deps = useLoaderDeps({ from: "/shop/category/best-sellers" });
  const { bestSellers } = useBestSellers({ deps: deps });
  const reviews = bestSellers.review_info.map((r) => ({
    _id: r._id,
    rating_average: r.rating_average,
    rating_count: r.rating_count,
  }));
  const [showSortBySelect, setShowSortBySelect] = useState(false);

  const reviewMap = new Map(
    reviews.map((review) => [review._id, review.rating_average])
  );
  const reviewTotalCountMap = new Map(
    reviews.map((review) => [review._id, review.rating_count])
  );
  const sortByMap = new Map([
    ["best_seller", "1"],
    ["best_rating", "2"],
    ["most_reviews", "3"],
    ["highest_price", "4"],
    ["lowest_price", "5"],
  ]);
  const sortByName = new URLSearchParams(window.location.search).get("sortBy");

  useEffect(() => {
    const overlay = document.getElementById("select-box-overlay");
    if (showSortBySelect) {
      overlay?.classList.add("show");
    } else {
      setTimeout(() => {
        overlay?.classList.remove("show");
      }, 200);
    }
  }, [showSortBySelect]);
  return (
    <main className="flex-1 py-4 px-2 lg:px-4">
      <h1 className="font-bold text-xl pb-2">Best Sellers</h1>
      <div className="filters dark:bg-amenusd p-2 rounded-md mb-2 relative">
        <ProductSortBySelectBox
          items={productSortByOptionValues}
          label="Sort By"
          isOpen={showSortBySelect}
          onOpenChange={setShowSortBySelect}
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
      </div>
      <div className="divider dark:bg-a2sd bg-a2s mb-2"></div>
      <div className="products flex flex-col lg:flex-row lg:flex-wrap lg:gap-3">
        {bestSellers.records_count > 0 ? (
          bestSellers.products.map((product) => (
            <ProductCard_Category
              key={product._id}
              product={product}
              reviewIdMap={reviewMap}
              reviewTotalCountMap={reviewTotalCountMap}
            />
          ))
        ) : (
          <div>No products to list.</div>
        )}
      </div>
      <div id="select-box-overlay" className="select-box-overlay"></div>
    </main>
  );
}

export default BestSellers;
