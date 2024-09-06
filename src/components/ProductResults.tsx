import { useSuspenseQuery } from "@tanstack/react-query";
import { queryFormSearchOptions } from "../routes/shop/products";
import React from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
const route = getRouteApi("/shop/products/");
import { ProductResponse } from "../types/ProductType";
function useSearchProducts(query: string) {
  const {
    data: { data: products_data },
  } = useSuspenseQuery(queryFormSearchOptions(query));

  return products_data as ProductResponse;
}

function ProductResults() {
  const { q } = route.useSearch();
  const products_data = useSearchProducts(q);

  return (
    <div>
      <h1 className="font-bold">
        Search Results - {products_data.records_count}
      </h1>
      <div>
        {products_data.products.length === 0 && (
          <p>No search results for '{q}'</p>
        )}
        {products_data.products.map((item, i) => {
          return (
            <div key={i} className="border my-2">
              <Link to={`/shop/product/${item._id}`}>
                <p>{item.name}</p>
                <p>price: ${item.price}</p>
                <p>
                  retail: $
                  <span
                    className={
                      item.price === item.retail_price ? "" : "line-through"
                    }
                  >
                    {item.retail_price.toString()}
                  </span>
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductResults;
