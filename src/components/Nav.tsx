import { useContext, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Switch, Button } from "react-aria-components";
import searchBtnLogo from "../assets/icons/searchIcon.svg";

function Nav({
  handleThemeChange,
}: {
  theme?: string;
  handleThemeChange: (newTheme: "dark" | "light") => void;
}) {
  const { cart, setCart } = useContext(CartContext);
  const [id, setId] = useState(1); //temp
  const searchFormSubmit = useRef<HTMLFormElement | null>(null);
  const searchInputElement = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    setCart((prev) => {
      return [...prev, { id: id.toString(), quantity: 1, price: 44 }];
    });
    setId(() => id + 1);
    console.log(cart.length, id);
  };
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleDeleteSearchInput = () => {
    setSearchInput("");
    if (searchInputElement?.current) {
      searchInputElement.current.focus();
    }
  };
  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form element:", searchFormSubmit.current);
    console.log("search query:", searchInput);
    if (searchInput.length === 0) {
      return location.reload();
    }
    return navigate({ to: "/shop/products", search: { q: searchInput } });
  };

  return (
    <nav className="border-b-2 dark:border-neutral-600 px-5">
      <ul className="flex gap-4 pt-1 justify-between items-center">
        <li>
          <div className="nav-left flex items-center">
            <Link to={"/"}>
              <div className="logo-container border-2 items-stretch text-2xl font-bold tracking-wide">
                Cyber Den
              </div>
            </Link>
          </div>
        </li>
        <li className="nav-search-container">
          <div>
            {/* outer search bar */}
            <form
              ref={searchFormSubmit}
              onSubmit={handleSearchFormSubmit}
              className="searchbar-form relative flex border shadow-sm rounded-md items-center justify-center h-[42px]"
            >
              <input
                className="font-medium py-1 pl-3 pr-10 rounded-l-md w-[35svw] flex-3 h-full dark:text-black"
                type="text"
                placeholder="Search products or categories..."
                aria-label="Search Input Field"
                onChange={handleSearchInput}
                value={searchInput}
                ref={searchInputElement}
              />
              {searchInput.length > 0 && (
                <button
                  className="absolute right-12 bg-gray-200 rounded-full px-[6px] hover:bg-gray-300  focus:bg-gray-300 dark:text-black dark:bg-slate-300"
                  onClick={handleDeleteSearchInput}
                  type="button"
                >
                  &#10005;
                </button>
              )}
              {/* <div className="rounded-r-md h-full"> */}
              <button
                className="flex justify-center items-center h-full px-2 border-l rounded-r-md dark:bg-blue-600"
                aria-label="Search"
                type="submit"
              >
                {/* <div className="bg-nav-searchIcon bg-no-repeat bg-contain w-[24px] h-[24px]"></div> */}
                <img
                  src={searchBtnLogo}
                  alt=""
                  className="min-w-6 bg-transparent rounded-r-md dark:[filter:invert(100%)sepia(37%)saturate(2%)hue-rotate(3deg)brightness(116%)contrast(101%)]"
                />
              </button>
            </form>
          </div>
        </li>
        <ul className="nav-right flex gap-5 items-center">
          <li>
            <Switch
              onChange={(isSelected) =>
                handleThemeChange(isSelected ? "light" : "dark")
              }
              isSelected={localStorage.getItem("theme") === "light"}
              className={`flex flex-col justify-center items-center group data-[hovered]:cursor-pointer`}
            >
              Theme
              <div
                className={`inline-flex items-center relative indicator w-10 h-6 bg-zinc-600 rounded-full transition border-2 border-transparent group-data-[focus-visible]:ring-2 ring-offset-1 ring-blue-500 group-data-[selected]:bg-sky-300 shadow-sm`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 bg-white rounded-full transition-all group-data-[selected]:ml-4 group-data-[selected]:bg-white`}
                ></div>
              </div>
            </Switch>
          </li>
          <li>
            <Button onPress={handleClick} className={`p-2 border-2`}>
              <span className="welcome text-sm">Welcome</span>
              <br />
              <span>Sign In / Register</span>
            </Button>
          </li>
          {/* /cart */}
          <li className="border-2">
            <Button
              className={"nav-cart p-2"}
              onPress={() => navigate({ to: "/cart" })}
            >
              <span className="nav-cartItems-number">{cart.length}</span>
              <div>CartIcon</div>
            </Button>
            {/* <button className="nav-cart p-2">
                <span className="nav-cartItems-number">{cart.length}</span>
                <div>CartIcon</div>
              </button> */}
          </li>
        </ul>
      </ul>

      {/* PUT UL element inside a variable that returns jsx and import it here??? - otherwise this component has many lines of code */}
      <ul className="flex justify-between items-center font-bold text-[.9rem] px-1 pt-2 pb-1.5 overflow-auto tracking-wide">
        <li className="flex hover:underline hover:underline-offset-8 hover:decoration-2">
          <Link to="/">
            <span className="hamburger-icon">Menu *</span>
          </Link>
        </li>
        <li className="text-red-600">
          <Link
            to={"/"}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Best Deals
          </Link>
        </li>
        <li>
          <Link
            to={"/"}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Best Sellers
          </Link>
        </li>
        <li>
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d71b9569596eb9af05f13" }}
            search={{ page: 1 }}
            replace={true}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Electronics
          </Link>
        </li>
        <li className="hidden md:block">
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d7ce06408ff45e381f14d" }}
            search={{ page: 1 }}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Home & Kitchen
          </Link>
        </li>
        <li className="hidden lg:block">
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d7ce06408ff45e381f149" }}
            search={{ page: 1 }}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Pet Supplies
          </Link>
        </li>
        <li className="hidden lg:block">
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d7ce16408ff45e381f150" }}
            search={{ page: 1 }}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Garden & Outdoors
          </Link>
        </li>
        <li className="hidden lg:block">
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d7ce16408ff45e381f153" }}
            search={{ page: 1 }}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Toys & Games
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
