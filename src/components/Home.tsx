import React, { Fragment } from "react";
import {
  popularProductQueryOptions,
  dealProductsQueryOptions,
} from "../routes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductResponse } from "../types/ProductType";
import { Link } from "@tanstack/react-router";

function useDealProducts() {
  const {
    data: { data: data_deals },
  } = useSuspenseQuery(dealProductsQueryOptions);
  return data_deals as ProductResponse;
}
function usePopularProducts() {
  const {
    data: { data: data_popular },
  } = useSuspenseQuery(popularProductQueryOptions);
  return data_popular as ProductResponse;
}

function Home() {
  const data_deals = useDealProducts();
  const data_popular = usePopularProducts();

  return (
    <div className="page-container mx-5 my-2">
      <div>
        <p className="font-bold">Products $25 and under</p>
        {data_deals.products &&
          data_deals.products.map((d, i) => (
            <Link to={`/shop/product/${d._id}`} key={i}>
              <div className="border rounded-lg p-2 my-4 dark:bg-neutral-800 dark:border-transparent">
                <p>
                  {i + 1}
                  {")"} {d.name}
                  [${d.price}]
                </p>
              </div>
            </Link>
          ))}
      </div>
      <hr />
      <div>
        <p className="font-bold">
          Popular products (currently more than 100 units sold)
        </p>
        {data_popular &&
          data_popular.products.map((d, i) => (
            <Fragment key={i}>
              <Link to={`/shop/product/${d._id}`}>
                <div className="border p-2 rounded-lg my-4 dark:border-transparent dark:bg-neutral-800">
                  <p key={i}>
                    {i + 1}
                    {") "} {d.name} [{d.total_bought} units sold]
                  </p>
                </div>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
}

export default Home;
