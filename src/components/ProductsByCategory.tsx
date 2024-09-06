import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import React from "react";
import {
  productsByCategoryOption,
  ShopURLQuery,
} from "../routes/shop/category/$categoryId";
import { ProductResponse } from "../types/ProductType";
const route = getRouteApi("/shop/category/$categoryId");

function useProductsFromCategory(categoryId: string, searchDeps: ShopURLQuery) {
  const {
    data: { data: product_data },
  } = useSuspenseQuery(productsByCategoryOption(categoryId, searchDeps));
  return product_data as ProductResponse;
}
function usePagination(
  currentPage: number,
  total_pages: number,
  searchDeps: ShopURLQuery = { page: currentPage }
) {
  if (currentPage === 0 || total_pages === 0) {
    const arrLeft = [""];
    const arrRight = [""];
    return { arrLeft, arrRight };
  }
  const arrLeft = Array(4)
    .fill(0)
    .map((v, i) => {
      if (i === 0 && currentPage !== 1) {
        return (
          <Link to="." search={{ ...searchDeps, page: 1 }} key={i}>
            <button className="px-2">1</button>
          </Link>
        );
      } else if (i === 1 && currentPage - 1 > 2) {
        return (
          <button className="px-2" key={i}>
            ...
          </button>
        );
      } else if (
        i === 2 &&
        currentPage - 2 > 1 &&
        currentPage - 2 < currentPage
      ) {
        return (
          <button className="px-2 minus_2" key={i}>
            {currentPage - 2}
          </button>
        );
      } else if (
        i === 3 &&
        currentPage - 1 > 1 &&
        currentPage - 1 < currentPage
      ) {
        return (
          <button className="px-2 minus_1" key={i}>
            {currentPage - 1}
          </button>
        );
      } else {
        return 0;
      }
    })
    .filter((d) => d !== 0);

  const arrRight = Array(4)
    .fill(0)
    .map((v, i) => {
      if (i === 0 && currentPage + 1 < total_pages) {
        return (
          <button className="px-2" key={i}>
            {currentPage + 1}
          </button>
        );
      } else if (i === 1 && currentPage + 2 < total_pages) {
        return (
          <button className="px-2" key={i}>
            {currentPage + 2}
          </button>
        );
      } else if (
        i === 2 &&
        total_pages !== currentPage &&
        total_pages - currentPage > 2
      ) {
        return (
          <button className="px-2" key={i}>
            ...
          </button>
        );
      } else if (i === 3 && total_pages !== currentPage) {
        return (
          <Link to="." search={{ ...searchDeps, page: total_pages }} key={i}>
            <button className="px-2">{total_pages}</button>
          </Link>
        );
      } else {
        return 0;
      }
    })
    .filter((d) => d !== 0);
  return { arrLeft, arrRight };
}

function ProductsByCategory() {
  const { categoryId } = route.useParams();
  const searchDeps = route.useSearch();
  const { page } = searchDeps;
  const products_data = useProductsFromCategory(categoryId, searchDeps);
  const { arrLeft, arrRight } = usePagination(
    page,
    products_data.total_pages,
    searchDeps
  );
  // console.log(searchDeps);
  // console.log(products_data);
  return (
    <>
      <main>
        <div>
          <Link
            to="/shop/category/$categoryId"
            params={{ categoryId }}
            search={{ page: page, pageSize: 3 }}
          >
            <button className="border border-1 bg-blue-400">Limit = 3</button>
          </Link>
        </div>
        ProductsByCategory with params: {categoryId}
        <p className="font-semibold">
          Search Results - {(products_data && products_data.records_count) || 0}
        </p>
        {products_data.products &&
          products_data.products.map((product, i) => (
            <div key={i} className="border my-2">
              <p>{product.name}</p>
              <p>${product.price}</p>
              {product.discount && product.discount * 100 > 4 ? (
                <p>
                  Save:{" "}
                  <span className="text-red-600">
                    {(product.discount * 100).toFixed(0) + "%"}
                  </span>
                </p>
              ) : null}
            </div>
          ))}
      </main>
      <div className="pagination-bar absolute bottom-7 w-full flex justify-center">
        <div className="pagination-buttons">
          <Link to="." search={{ ...searchDeps, page: page - 1 }}>
            <button
              className={`bg-gray-300 p-2 border-r-2 border-gray-400 ${page === 1 && "bg-gray-400"}`}
              disabled={page <= 1}
            >
              Previous
            </button>
          </Link>

          {arrLeft}
          {/* Current Page Button */}
          <button
            disabled={true}
            className="bg-gray-500 p-2 border-l-1 border-black"
          >
            {page}
          </button>

          {arrRight}

          <Link to={"."} search={{ ...searchDeps, page: page + 1 }}>
            <button
              className={`bg-gray-300 p-2 border-l-2 border-gray-400 ${page >= products_data.total_pages && "bg-gray-400"}`}
              disabled={page >= products_data.total_pages}
            >
              Next
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ProductsByCategory;
