import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import ProductCard from "./ProductCard";
import React, { useContext } from "react";
import {
  productsByCategoryOption,
  ShopURLQuery,
} from "../routes/shop/category/$categoryId";
import { ProductResponse } from "../types/ProductType";
import { PaginationBar } from "./PaginationBar";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import { CartContext } from "../context/CartContext";
const route = getRouteApi("/shop/category/$categoryId");

function useProductsFromCategory(categoryId: string, searchDeps: ShopURLQuery) {
  const {
    data: { data: product_data },
  } = useSuspenseQuery(productsByCategoryOption(categoryId, searchDeps));
  // console.log(product_data);
  return product_data as ProductResponse;
}

function ProductsByCategory() {
  const { categoryId } = route.useParams();
  const searchDeps = route.useSearch();
  const { page } = searchDeps;
  const products_data = useProductsFromCategory(categoryId, searchDeps);
  const { cart } = useContext(CartContext);
  const cartList = cart.map((p) => p._id);
  // const screenS = window.matchMedia("(min-width: 1024px)").matches;
  // const [isLargeScreen, setIsLargeScreen] = useState(screenS);
  const { isDesktop } = useContext(ScreenSizeContext);

  return (
    <main className="xl:max-w-[1500px] xl:mx-auto mt-4 mb-6 lg:p-6">
      <h1 className="font-bold ml-2 lg:ml-0">{searchDeps.category}</h1>
      <div
        className={
          "card-container lg:grid lg:grid-cols-[repeat(4,1fr)] xl:grid-cols-[repeat(5,1fr)] flex flex-col mt-6 gap-4"
        }
      >
        {products_data.products.map((product, i) => (
          <ProductCard
            key={i}
            orientation={isDesktop ? "col" : "row"}
            item={product}
            isScreenSizeLarge={isDesktop}
            reviewInfo={products_data.review_info}
            cartList={cartList}
          ></ProductCard>
        ))}
      </div>
      {products_data.products && (
        <div className="pagination-bar bg-white dark:bg-dark-secondary-gray px-4 py-2 mt-6 flex justify-center lg:justify-end">
          <PaginationBar
            currentPage={page}
            totalPages={products_data.total_pages}
            searchDeps={searchDeps}
            isLargeScreenSize={isDesktop}
          />
        </div>
      )}
      <div className="blank-space min-h-[300px]"></div>
    </main>
  );
}

export default ProductsByCategory;
