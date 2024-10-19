import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductSearch, queryFormSearchOptions } from "../routes/shop/products";
import React, { useContext, useEffect, useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
const route = getRouteApi("/shop/products/");
import { ProductResponse } from "../types/ProductType";
import ProductCard from "./ProductCard";
import { PaginationBar } from "./PaginationBar";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import { trimString } from "../utilities/trimString";
import ProductSortBySelectBox from "./ProductSortBySelectBox";
import { ListBoxItem, Section } from "react-aria-components";

function useSearchProducts(query: string, searchDeps: ProductSearch) {
  const {
    data: { data: products_data },
  } = useSuspenseQuery(queryFormSearchOptions(query, searchDeps));
  // console.log("data returned:", products_data);

  return products_data as ProductResponse;
}
function ProductResults() {
  const searchDeps = route.useSearch();
  const products_data = useSearchProducts(searchDeps.q, searchDeps);
  const productSortByOptionValues = [
    {
      name: "Best Selling",
      id: "1",
      href: "." as const,
      deps: {
        search: { ...searchDeps, q: searchDeps.q, sortBy: undefined, page: 1 },
      } as const,
    },
    {
      name: "Best Deal",
      id: "2",
      href: "." as const,
      deps: {
        search: { ...searchDeps, sortBy: "best_deal", page: 1 },
      } as const,
    },
    {
      name: "Best Rating",
      id: "3",
      href: "." as const,
      deps: {
        search: { ...searchDeps, sortBy: "best_rating", page: 1 },
      } as const,
    },
    {
      name: "Most Reviews",
      id: "4",
      href: "." as const,
      deps: {
        search: { ...searchDeps, sortBy: "most_reviews", page: 1 },
      } as const,
    },
    {
      name: "Highest Price",
      id: "5",
      href: "." as const,
      deps: {
        search: { ...searchDeps, sortBy: "highest_price", page: 1 },
      } as const,
    },
    {
      name: "Lowest Price",
      id: "6",
      href: "." as const,
      deps: {
        search: { ...searchDeps, sortBy: "lowest_price", page: 1 },
      } as const,
    },
  ];
  const [showSortBySelectBox, setShowSortBySelectBox] = useState(false);
  const { isDesktop } = useContext(ScreenSizeContext);
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
      <main className="page-container flex-1 py-4 px-2 lg:px-4">
        {/* <h1 className="font-bold mb-6 pl-2">Search: "{searchDeps.q}"</h1> */}
        <h1 className="text-xl font-bold mt-2 text-a1d">
          <span className="italic">
            Search: "{trimString(searchDeps.q, 20)}"
          </span>
        </h1>
        {products_data.records_count > 0 && (
          <div className="filters mt-2 dark:bg-amenusd p-2 rounded-md mb-2 relative">
            <ProductSortBySelectBox
              label="Sort By "
              isOpen={showSortBySelectBox}
              onOpenChange={setShowSortBySelectBox}
              items={productSortByOptionValues}
              selectedKey={sortByMap.get(sortByName || "") || "1"}
            >
              <Section className="flex flex-col">
                {productSortByOptionValues.map((option) => {
                  return (
                    <ListBoxItem
                      id={option.id}
                      textValue={option.name}
                      className={({
                        isPressed,
                        isSelected,
                        isHovered,
                        isFocusVisible,
                      }) =>
                        `py-3 px-6 ring-0 outline-none border-none ${isSelected ? "dark:bg-a2sd" : isPressed || isHovered || isFocusVisible ? "dark:bg-[#4d4d4d]" : ""}`
                      }
                      key={option.id}
                      href={option.href}
                      routerOptions={option.deps}
                    >
                      {option.name}
                    </ListBoxItem>
                  );
                })}
              </Section>
            </ProductSortBySelectBox>
          </div>
        )}
        <div className="divider bg-a3sd mb-2"></div>
        <div className="products flex flex-col lg:mt-4">
          {products_data.products.map((product, i) => (
            <ProductCard
              item={product}
              reviewInfo={products_data.review_info}
              key={i}
            />
          ))}
          {products_data.products.length <= 0 && (
            <div>
              <p className="dark:text-red-500 text-[#CC0C39]">
                We have found zero searches for "{trimString(searchDeps.q, 70)}"
              </p>
            </div>
          )}
        </div>
        {/* <div className="space h-[200px]"></div> */}
      </main>
      <div className="pagination-bar px-4 py-2 mt-6 flex justify-center">
        <PaginationBar
          currentPage={searchDeps.page}
          totalPages={products_data.total_pages}
          searchDeps={searchDeps}
          isLargeScreenSize={isDesktop}
        />
      </div>
      <div id="select-box-overlay" className="select-box-overlay"></div>
    </>
  );
}

export default ProductResults;
