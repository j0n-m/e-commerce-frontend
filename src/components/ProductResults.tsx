import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductSearch, queryFormSearchOptions } from "../routes/shop/products";
import React, { useContext } from "react";
import { getRouteApi } from "@tanstack/react-router";
const route = getRouteApi("/shop/products/");
import { ProductResponse } from "../types/ProductType";
import ProductCard from "./ProductCard";
import { PaginationBar } from "./PaginationBar";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import { trimString } from "../utilities/trimString";
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

  const { isDesktop } = useContext(ScreenSizeContext);
  console.log(products_data);

  return (
    <>
      <main className="page-container mt-2 px-4 lg:px-6 flex-1">
        {/* <h1 className="font-bold mb-6 pl-2">Search: "{searchDeps.q}"</h1> */}
        <div className="filters bg-white dark:bg-dark-secondary-gray px-4 py-1 rounded-md">
          filters
        </div>
        <h1 className="text-xl font-bold mt-4">Results</h1>
        <h2 className="text-sm dark:text-slate-400 text-slate-500">
          for "{trimString(searchDeps.q, 20)}"
        </h2>
        <div className="content flex flex-col lg:mt-4">
          {products_data.products.map((product, i) => (
            <ProductCard
              item={product}
              reviewInfo={products_data.review_info}
              key={i}
              isScreenSizeLarge={isDesktop}
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
    </>
  );
}

export default ProductResults;
