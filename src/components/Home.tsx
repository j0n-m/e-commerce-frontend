import {
  popularProductQueryOptions,
  dealProductsQueryOptions,
} from "../routes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductResponse, ProductType } from "../types/ProductType";
import { Link } from "@tanstack/react-router";
import noProductImage from "../assets/images/no_product_image.jpg";
import { trimString } from "../utilities/trimString";
import { IconChevronRight } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";

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

type DisplayCardProps = {
  product: ProductType;
};
function DisplayCard({ product }: DisplayCardProps) {
  return (
    <div
      key={product._id}
      className="product-card dark:bg-a1sd bg-a1s rounded-lg flex flex-col gap-3 px-2 py-3 lg:p-5 w-[calc(100%/1)] xs:w-[calc(100%/2-4px)] md:w-[calc(100%/3-6px)] lg:w-[calc(100%/4-10px)] xl:w-[calc(100%/5-10px)]"
    >
      <div className="section-content flex-1 flex flex-col">
        <div className="title flex-1">
          <Link
            to={"/shop/product/$productId"}
            params={{ productId: product._id }}
            className="active:underline hover:underline"
          >
            <h2 className="lg:hidden">{trimString(product.name)}</h2>
            <h2 className="hidden lg:block">{trimString(product.name, 115)}</h2>
          </Link>
        </div>
        <div className="flex flex-col justify-end">
          <p>
            <span className="text-lg lg:text-2xl">$</span>
            <span className="text-lg font-bold lg:text-2xl">
              {product.price.toFixed(2)}{" "}
            </span>
          </p>
        </div>
      </div>
      <div className="section-img relative rounded-md overflow-hidden bg-white flex flex-col justify-center items-center lg:max-w-full">
        <Link
          to={"/shop/product/$productId"}
          params={{ productId: product._id }}
          className="hover:cursor-pointer"
        >
          {product?.discount && (
            <div className="discount-overlay select-none flex flex-col justify-center items-center absolute right-1 top-1 p-3 aspect-square min-h-[75px] rounded-full bg-red-500 text-white opacity-90">
              <span className="-mb-1">Save</span>
              <span className="font-bold text-xl">
                {(product.discount * 100).toFixed(0)}%
              </span>
            </div>
          )}
          <img
            className="w-[calc(100%)] max-w-[200px] aspect-square rounded-md object-contain"
            src={product.image_src || noProductImage}
            alt={
              product.image_src ? product.name : "No Product Image Available"
            }
          />
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const productDeals = useDealProducts();
  const productPopular = usePopularProducts();

  return (
    <main className="page-container flex-1 pb-40 px-2 pt-1 lg:px-4">
      <Helmet>
        {/* <link rel="preload" href={fallBanner} as="image"></link> */}
      </Helmet>
      <div className="banner-container w-full mb-2">
        <div className="">
          <div className="banner_home rounded-md select-none relative flex flex-col justify-center items-center py-4">
            <h3 className="text-orange-700 text-[50px] lg:text-[60px] lg:mt-8 font-[MumbaiSticker]">
              Autumn
            </h3>
            <h3 className="text-orange-800 uppercase lg:-mt-14 text-[60px] -mt-10 lg:text-[90px] font-bold">
              Sale
            </h3>
            <h3 className="uppercase text-orange-800 text-[18px] -mt-4 lg:-mt-6 font-semibold">
              Discount up to 50% off
            </h3>
            <Link
              to="/shop/category/best-deals"
              className="lg:mt-2 mt-2 hover:scale-105 transition-transform duration-300"
            >
              <span className="uppercase rounded-full bg-orange-700 text-white lg:px-3 lg:py-1 px-3 py-1">
                Shop now
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="product-deals-container">
        <Link to="/shop/category/best-deals" className="lg:hidden">
          <h2 className="font-bold text-xl lg:text-2xl py-3 lg:py-5 flex items-center justify-between lg:block">
            <span>Today's best deals</span>
            <IconChevronRight className="lg:hidden" />
          </h2>
        </Link>
        <h2 className="font-bold text-xl lg:text-2xl py-3 lg:py-5 hidden lg:block">
          <span>Today's best deals</span>
        </h2>
        <div className="product-container flex flex-row flex-wrap gap-2 lg:gap-3">
          {productDeals.products.map((product) => {
            return (
              <DisplayCard key={product._id} product={product}></DisplayCard>
            );
          })}
        </div>
        <div className="see-more flex justify-center items-center mt-4">
          <Link
            className="px-4 py-2 font-bold bg-[#0070ba] dark:text-a0d text-white rounded-full active:bg-[#0070ba]/80 hover:bg-[#0070ba]/95 hover:scale-105 transition-transform duration-200"
            to="/shop/category/best-deals"
          >
            See all deals
          </Link>
        </div>
      </div>
      <div className="product-popular-container mt-5">
        <Link to="/shop/category/best-sellers" className="lg:hidden">
          <h2 className="font-bold text-xl lg:text-2xl py-3 lg:py-5 flex items-center justify-between lg:block">
            <span>Top selling products</span>
            <IconChevronRight className="lg:hidden" />
          </h2>
        </Link>
        <h2 className="font-bold text-xl lg:text-2xl py-3 lg:py-5 hidden lg:block">
          <span>Top selling products</span>
        </h2>
        <div className="product-container flex flex-row flex-wrap gap-2 lg:gap-3">
          {productPopular.products.map((product) => {
            return (
              <DisplayCard key={product._id} product={product}></DisplayCard>
            );
          })}
        </div>
        <div className="see-more flex justify-center items-center mt-4">
          <Link
            className="px-4 py-2 font-bold bg-[#0070ba] dark:text-a0d text-white rounded-full active:bg-[#0070ba]/80 hover:bg-[#0070ba]/95 hover:scale-105 transition-transform duration-200"
            to="/shop/category/best-sellers"
          >
            See all best sellers
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Home;
