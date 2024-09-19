import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductSearch, queryFormSearchOptions } from "../routes/shop/products";
import React, { useContext } from "react";
import { getRouteApi } from "@tanstack/react-router";
const route = getRouteApi("/shop/products/");
import { ProductResponse } from "../types/ProductType";
import ProductCard from "./ProductCard";
import { PaginationBar } from "./PaginationBar";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
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

  return (
    <div className="page-container xl:max-w-[1500px] xl:mx-auto pt-4 lg:p-6">
      <h1 className="font-bold mb-6 pl-2">Search: "{searchDeps.q}"</h1>
      <div className="filters bg-white dark:bg-dark-secondary-gray px-4 py-1 rounded-md">
        filters
      </div>
      <main className="content flex flex-col lg:mt-4 rounded-md">
        {products_data.products.map((product, i) => (
          <ProductCard
            item={product}
            reviewInfo={products_data.review_info}
            key={i}
            isScreenSizeLarge={isDesktop}
          />
        ))}
      </main>
      <div className="pagination-bar bg-white dark:bg-dark-secondary-gray px-4 py-2 mt-6 flex justify-center lg:justify-end">
        <PaginationBar
          currentPage={searchDeps.page}
          totalPages={products_data.total_pages}
          searchDeps={searchDeps}
          isLargeScreenSize={isDesktop}
        />
      </div>

      <div className="blank-space min-h-[300px]"></div>
    </div>
  );
}

export default ProductResults;
