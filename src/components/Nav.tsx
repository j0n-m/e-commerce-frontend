import { useContext, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Switch, Button } from "react-aria-components";
import { IconSearch, IconX } from "@tabler/icons-react";
import { ThemeContext } from "../context/ThemeContext";

function Nav() {
  const { cart } = useContext(CartContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const searchFormSubmit = useRef<HTMLFormElement | null>(null);
  const searchInputElement = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

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
    return navigate({
      to: "/shop/products",
      search: { q: searchInput, page: 1 },
    });
  };
  const handleThemeChange = (themeValue: "auto" | "dark" | "light") => {
    const lsTheme = localStorage.getItem("theme");
    if (lsTheme !== themeValue) {
      localStorage.setItem("theme", themeValue);
    }
    setTheme(themeValue);
  };

  return (
    <nav className="border-b-2 dark:border-gray-800 px-5 flex flex-col dark:bg-gray-900">
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
        <li className="nav-search-container rounded-md">
          <div className="rounded-md">
            {/* outer search bar */}
            <form
              ref={searchFormSubmit}
              onSubmit={handleSearchFormSubmit}
              className="searchbar-form relative flex outline outline-2 outline-gray-200 shadow-sm rounded-md items-center justify-center h-[42px] dark:outline-slate-800"
            >
              <input
                className="font-medium py-1 pl-3 pr-10 focus:border focus:border-blue-600 focus:dark:border-r-slate-800 outline-none rounded-l-md w-[35svw] flex-3 h-full dark:bg-slate-800"
                type="text"
                placeholder="Search products or categories..."
                aria-label="Search Input Field"
                onChange={handleSearchInput}
                value={searchInput}
                ref={searchInputElement}
              />
              {searchInput.length > 0 && (
                <Button
                  className={({
                    isHovered,
                    isFocusVisible,
                  }) => `absolute right-12 rounded-full p-1 dark:text-black
                    ${isHovered || isFocusVisible ? "bg-slate-200 dark:bg-slate-600" : ""}
                  `}
                  onPress={handleDeleteSearchInput}
                  type="button"
                >
                  <IconX
                    className="dark:text-white"
                    height={28}
                    width={28}
                    stroke={1.25}
                  />
                </Button>
              )}
              <Button
                type="submit"
                className={({
                  isFocusVisible,
                  isHovered,
                }) => `h-full dark:bg-blue-600 z-10 rounded-tr-md flex justify-center items-center rounded-br-md px-1 transition-all
                  ${isHovered || isFocusVisible ? "dark:bg-blue-700 scale-[1.025] shadow-md bg-white" : ""}
                  `}
                aria-label="search"
              >
                <IconSearch className="" stroke={1.5} size={30}></IconSearch>
              </Button>
              {/* <button
                className="flex justify-center items-center h-full px-2 border-l rounded-r-md focus:bg-blue-300 dark:bg-blue-700"
                aria-label="Search"
                type="submit"
              >
                <IconSearch stroke={2} size={32}></IconSearch>
              </button> */}
            </form>
          </div>
        </li>
        <ul className="nav-right flex gap-5 items-center">
          <li>
            <Switch
              onChange={(isSelected) =>
                handleThemeChange(isSelected ? "light" : "dark")
              }
              isSelected={theme === "light"}
              className={`flex flex-col justify-center items-center group data-[hovered]:cursor-pointer`}
            >
              Theme
              <div
                className={`inline-flex items-center relative indicator w-10 h-6 bg-zinc-600 rounded-full transition border-2 border-transparent group-data-[focus-visible]:ring-2 ring-offset-1 ring-blue-500 group-data-[selected]:bg-sky-300 shadow-sm`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 bg-white rounded-full transition-all group-data-[selected]:ml-[18px] group-data-[selected]:bg-white`}
                ></div>
              </div>
            </Switch>
          </li>
          <li>
            <Button className={`p-2 border-2`}>
              <span className="welcome text-sm">Welcome</span>
              <br />
              <span>Sign In / Register</span>
            </Button>
          </li>
          {/* /cart */}
          <li className="border-2">
            <Button
              aria-label="Go to cart"
              className={"nav-cart p-2"}
              onPress={() => navigate({ to: "/cart" })}
            >
              <span className="nav-cartItems-number">
                {cart.reduce((prev, curr) => prev + curr.cart_quantity, 0)}
              </span>
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
        <li className="text-[#CC0C39] dark:text-red-500">
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
            search={{ page: 1, category: "Electronics" }}
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
            search={{ page: 1, category: "Home & Kitchen" }}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Home & Kitchen
          </Link>
        </li>
        <li className="hidden lg:block">
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d7ce06408ff45e381f149" }}
            search={{ page: 1, category: "Pet Supplies" }}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Pet Supplies
          </Link>
        </li>
        <li className="hidden lg:block">
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d7ce16408ff45e381f150" }}
            search={{ page: 1, category: "Garden & Outdoors" }}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Garden & Outdoors
          </Link>
        </li>
        <li className="hidden lg:block">
          <Link
            to={"/shop/category/$categoryId"}
            params={{ categoryId: "668d7ce16408ff45e381f153" }}
            search={{ page: 1, category: "Toys & Games" }}
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
