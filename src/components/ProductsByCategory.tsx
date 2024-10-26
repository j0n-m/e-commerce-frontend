import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import {
  productsByCategoryOption,
  ShopURLQuery,
} from "../routes/shop/category/$categoryId";
import { ProductResponse } from "../types/ProductType";
import { PaginationBar } from "./PaginationBar";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import ProductCard_Category from "./ProductCard_Category";
import { Section } from "react-aria-components";
import ProductSortBySelectBox from "./ProductSortBySelectBox";
import { mappedIds } from "../utilities/NavLinks";
import SortBoxListItem from "./SortBoxListItem";
const route = getRouteApi("/shop/category/$categoryId");

export const productSortByOptionValues = [
  {
    name: "Best Selling",
    id: "1",
    href: "." as const,
    deps: { search: { page: 1 } } as const,
  },
  {
    name: "Best Deal",
    id: "2",
    href: "." as const,
    deps: { search: { page: 1, sortBy: "best_deal" } } as const,
  },
  {
    name: "Best Rating",
    id: "3",
    href: "." as const,
    deps: { search: { sortBy: "best_rating", page: 1 } } as const,
  },
  {
    name: "Most Reviews",
    id: "4",
    href: "." as const,
    deps: { search: { sortBy: "most_reviews", page: 1 } } as const,
  },
  {
    name: "Highest Price",
    id: "5",
    href: "." as const,
    deps: { search: { sortBy: "highest_price", page: 1 } } as const,
  },
  {
    name: "Lowest Price",
    id: "6",
    href: "." as const,
    deps: { search: { sortBy: "lowest_price", page: 1 } } as const,
  },
];
function useProductsFromCategory(categoryId: string, searchDeps: ShopURLQuery) {
  const {
    data: { data: product_data },
  } = useSuspenseQuery(productsByCategoryOption(categoryId, searchDeps));
  // (product_data);
  return product_data as ProductResponse;
}

function ProductsByCategory() {
  const { categoryId } = route.useParams();
  const searchDeps = route.useSearch();
  const { page } = searchDeps;
  const products_data = useProductsFromCategory(categoryId, searchDeps);
  const reviews = products_data.review_info.map((r) => ({
    _id: r._id,
    rating_average: r.rating_average,
    rating_count: r.rating_count,
  }));
  const { isDesktop } = useContext(ScreenSizeContext);
  const [showSortBySelectBox, setShowSortBySelectBox] = useState(false);
  const categoryName = mappedIds.get(categoryId);
  const reviewMap = new Map(reviews.map((r) => [r._id, r.rating_average]));
  const reviewTotalCountMap = new Map(
    reviews.map((r) => [r._id, r.rating_count])
  );
  const sortByMap = new Map([
    ["best_selling", "1"],
    ["best_deal", "2"],
    ["best_rating", "3"],
    ["most_reviews", "4"],
    ["highest_price", "5"],
    ["lowest_price", "6"],
  ]);
  const sortByName = new URLSearchParams(window.location.search).get("sortBy");
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
        <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
          {categoryName}
        </h1>
        <div className="filters dark:bg-amenusd p-2 rounded-md mb-2 relative">
          <ProductSortBySelectBox
            isOpen={showSortBySelectBox}
            onOpenChange={setShowSortBySelectBox}
            items={productSortByOptionValues}
            selectedKey={sortByMap.get(sortByName || "") || "1"}
            label="Sort By "
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
          {products_data.products.map((product) => (
            <ProductCard_Category
              key={product._id}
              product={product}
              reviewIdMap={reviewMap}
              reviewTotalCountMap={reviewTotalCountMap}
            />
          ))}
        </div>
      </main>
      {products_data.products && (
        <div className="pagination-bar bg-white dark:bg-a1sd px-4 py-2 mt-6 flex justify-center lg:justify-end">
          <PaginationBar
            currentPage={page}
            totalPages={products_data.total_pages}
            searchDeps={searchDeps}
            isLargeScreenSize={isDesktop}
          />
        </div>
      )}
      <div id="select-box-overlay" className="select-box-overlay"></div>
    </>
  );
}

export default ProductsByCategory;
