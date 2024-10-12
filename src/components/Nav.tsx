import { useContext, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogTrigger,
  Form,
  Heading,
  Input,
  Link as LinkAria,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  ModalOverlay,
  Popover,
} from "react-aria-components";
import { Switch, Button } from "react-aria-components";
import {
  IconSearch,
  IconX,
  IconShoppingCart,
  IconChevronDown,
  IconMenu2,
  IconUserCircle,
} from "@tabler/icons-react";
import { ThemeContext } from "../context/ThemeContext";
import useAuth from "../hooks/useAuth";
import SignOutBtn from "./SignOutBtn";
import { LogoutRef } from "./SignOutBtn";
import { trimString } from "../utilities/trimString";
import { ScreenSizeContext } from "../context/ScreenSizeContext";

const navLinks = [
  {
    label: "Best Deals",
    link: "/",
    className: "text-[#E01A2B] dark:text-[#E93F4D]",
    id: "1",
  },
  {
    label: "Best Sellers",
    link: "/",
    className: "text-[#E01A2B] dark:text-[#E93F4D]",
    id: "2",
  },
  {
    label: "Electronics",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d71b9569596eb9af05f13" },
    search: { page: 1, category: "Electronics" },
    id: "668d71b9569596eb9af05f13",
  },
  {
    label: "Home & Kitchen",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce06408ff45e381f14d" },
    search: { page: 1, category: "Home & Kitchen" },
    id: "668d7ce06408ff45e381f14d",
  },
  {
    label: "Pet Supplies",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce06408ff45e381f149" },
    search: { page: 1, category: "Pet Supplies" },
    id: "668d7ce06408ff45e381f149",
  },
  {
    label: "Garden & Outdoors",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce16408ff45e381f150" },
    search: { page: 1, category: "Garden & Outdoors" },
    id: "668d7ce16408ff45e381f150",
  },
  {
    label: "Toys & Games",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce16408ff45e381f153" },
    search: { page: 1, category: "Toys & Games" },
    id: "668d7ce16408ff45e381f153",
  },
];

function Nav() {
  const { cart } = useContext(CartContext);
  const { isDesktop, isTablet } = useContext(ScreenSizeContext);
  const { setTheme } = useContext(ThemeContext);
  const searchFormSubmit = useRef<HTMLFormElement | null>(null);
  const searchInputElement = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDarkMode = Array.from(document.documentElement.classList).includes(
    "dark"
  );

  // const signoutBtn = useRef<ChildRef>(null)
  const signout2 = useRef<LogoutRef>(null);
  const cartQuantity = cart.reduce(
    (prev, curr) => prev + curr.cart_quantity,
    0
  );

  const searchBar = () => {
    return (
      <div className="search-bar">
        <Form
          onSubmit={handleSearchFormSubmit}
          className={`flex mt-2 md:mt-0 ring-1 dark:ring-slate-800 rounded-lg relative`}
        >
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={
              "flex-1 h-[40px] md:h-[36px] rounded-lg dark:bg-slate-800 py-2 pl-3 pr-20"
            }
          ></Input>
          <Button
            type="submit"
            className={({ isHovered, isFocusVisible }) =>
              `absolute top-0 bottom-0 dark:bg-slate-700 right-0 px-2 rounded-r-lg ${isHovered || isFocusVisible ? "dark:bg-slate-500" : ""}`
            }
          >
            <IconSearch stroke={1.5}></IconSearch>
          </Button>
          {searchInput.length > 0 && (
            <Button
              className={({
                isHovered,
                isFocusVisible,
              }) => `absolute right-11 top-1 bottom-1 w-[30] aspect-square rounded-full flex items-center justify-center dark:text-black
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
        </Form>
      </div>
    );
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
  const handleSignout = () => {
    if (signout2.current) {
      signout2.current.handleSignOut();
    }
  };
  return (
    <nav className="px-4 pt-2 md:pt-3">
      <ul className="flex items-center">
        <li>
          <div className="menu-btn flex items-center">
            <DialogTrigger>
              <Button className={""}>
                <IconMenu2 size={30} stroke={1.2}></IconMenu2>
              </Button>
              <ModalOverlay
                isDismissable={true}
                className={
                  "modal-overlay fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
                }
              >
                <Modal
                  isDismissable={true}
                  className={
                    "fixed menu-slide top-0 bottom-0 left-0 w-[75%] bg-[rgba(0,0,0,0.8)] p-2 dark:bg-gray-800 bg-white rounded-md z-40"
                  }
                >
                  <Dialog className="rounded-md relative h-full">
                    {({ close }) => (
                      <>
                        <div className="">
                          <Button
                            className={`data-[hovered]:text-gray-400 absolute top-0 -right-11`}
                            onPress={() => close()}
                          >
                            <IconX stroke={1.25} size={34}></IconX>
                          </Button>
                        </div>
                        <Heading slot="title" className="p-2">
                          <div className="logo-container2 flex justify-between items-center">
                            <span className="logo text-xl rounded-lg px-2 uppercase items-stretch tracking-wider">
                              Cyber Den
                            </span>
                            {user ? (
                              <SignOutBtn
                                className="flex"
                                text="Sign out"
                                ref={signout2}
                              />
                            ) : (
                              // <SignOutBtn className="inline" text="" ref={signout2} />
                              <Button
                                className={
                                  "border border-[#dedede] py-1 px-2 rounded-lg mr-2 hidden xxs:block"
                                }
                                aria-label="Go to sign in"
                                onPress={() => {
                                  navigate({ to: "/signin" });
                                  close();
                                }}
                              >
                                Sign In
                              </Button>
                            )}
                          </div>
                        </Heading>
                        <div className="modal-body flex flex-col mt-2">
                          {user && (
                            <div className="flex flex-col">
                              <Button
                                onPress={() => {
                                  navigate({ to: "/account" });
                                  close();
                                }}
                                className="py-2 text-start"
                              >
                                Account
                              </Button>
                              <h2 className="border-t py-2 font-bold text-lg">
                                Shop by Category
                              </h2>
                              <Button className={"text-start"}>
                                Electronics
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          </div>
        </li>
        <li>
          <div className="nav-left flex items-center">
            <Link to={"/"}>
              <div className="logo-container">
                <span className="logo text-xl rounded-lg px-2 uppercase items-stretch tracking-wider">
                  Cyber Den
                </span>
              </div>
            </Link>
          </div>
        </li>
        <li className="hidden flex-1 md:block px-6">{searchBar()}</li>
        <li className="hidden lg:flex lg:mr-3">
          <Switch
            onChange={(isSelected) =>
              handleThemeChange(isSelected ? "light" : "dark")
            }
            isSelected={isDarkMode === false}
            className={`flex flex-col justify-center items-center group data-[hovered]:cursor-pointer`}
          >
            <div
              className={`inline-flex items-center relative indicator w-10 h-6 bg-zinc-600 rounded-full transition border-2 border-transparent group-data-[focus-visible]:ring-2 ring-offset-1 ring-blue-500 group-data-[selected]:bg-sky-300 shadow-sm`}
            >
              <div
                className={`flex items-center justify-center w-5 h-5 bg-white rounded-full transition-all group-data-[selected]:ml-[18px] group-data-[selected]:bg-white`}
              ></div>
            </div>
          </Switch>
        </li>
        <li className="ml-auto flex">
          {user ? (
            <LinkAria
              className={"flex mr-2 items-center gap-1"}
              href="/account"
            >
              <span className="hidden xs:block">
                {trimString(user.first_name, 12)}
              </span>
              <IconUserCircle stroke={1} size={34}></IconUserCircle>
            </LinkAria>
          ) : (
            <LinkAria
              href="/signin"
              className={
                "border border-[#dedede] py-1 px-2 rounded-lg mr-2 hidden xxs:block"
              }
            >
              Sign In
            </LinkAria>
          )}
        </li>
        <li>
          <LinkAria
            aria-label="Go to cart"
            className={({ isHovered, isFocusVisible }) =>
              `nav-cart flex-1 relative flex justify-center items-center ${isHovered || isFocusVisible ? "outline outline-neutral-300 dark:outline-neutral-200" : ""}`
            }
            href="/cart"
          >
            {cartQuantity > 0 && (
              <p className="nav-cartItems-number absolute min-w-[20px] min-h-[20px] text-center p-[2px] aspect-square flex items-center justify-center rounded-full bottom-0 right-0 font-bold text-[.9rem] border border-[#575757] dark:bg-[#282828] bg-white">
                <span className="text-[#ff914d]">{cartQuantity}</span>
              </p>
            )}
            <IconShoppingCart size={34} stroke={1} />
          </LinkAria>
        </li>
      </ul>
      <div className="md:hidden">{searchBar()}</div>
      {/* <div className="search-bar">
        <Form
          onSubmit={handleSearchFormSubmit}
          className="flex mt-2 ring-1 dark:ring-slate-800 rounded-lg relative"
        >
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={
              "flex-1 h-[40px] rounded-lg dark:bg-slate-800 py-2 pl-3 pr-20"
            }
          ></Input>
          <Button
            type="submit"
            className={({ isHovered, isFocusVisible }) =>
              `absolute top-0 bottom-0 dark:bg-slate-700 right-0 px-2 rounded-r-lg ${isHovered || isFocusVisible ? "dark:bg-slate-500" : ""}`
            }
          >
            <IconSearch stroke={1.5}></IconSearch>
          </Button>
          {searchInput.length > 0 && (
            <Button
              className={({
                isHovered,
                isFocusVisible,
              }) => `absolute right-11 top-1 bottom-1 w-[30] aspect-square rounded-full flex items-center justify-center dark:text-black
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
        </Form>
      </div> */}
      <ul className="nav-category-links flex overflow-x-scroll text-nowrap bg-scroll gap-4 px-1 pb-1 mt-2 justify-around">
        {navLinks.map((link) => {
          return (
            <li key={link.id} className="flex">
              <Link
                to={link.link}
                search={link.search}
                params={link.params}
                className={`hover:opacity-80 underline-offset-[5px] py-1 text-600 ${link.className ? link.className : ""}`}
              >
                {({ isActive }) => (
                  <span className={`${isActive ? "underline" : ""}`}>
                    {link.label}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <nav className="border-b-2 relative dark:border-gray-800 px-5 flex flex-col dark:bg-gray-900">
      <ul className="flex gap-4 pt-1 justify-between items-center">
        <li>
          <div className="nav-left flex items-center">
            <Link to={"/"}>
              <div className="logo-container ">
                {/* background: linear-gradient(#e66465, #9198e5); */}
                {/* bg-[linear-gradient(#111827,#727272)] */}
                <span className="logo text-2xl rounded-lg px-2 uppercase items-stretch tracking-wider">
                  Cyber Den
                </span>
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
                }) => `h-full dark:bg-blue-600 rounded-tr-md flex justify-center items-center rounded-br-md px-1 transition-all
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
        <ul className="nav-right flex gap-4">
          <li>
            <Switch
              onChange={(isSelected) =>
                handleThemeChange(isSelected ? "light" : "dark")
              }
              isSelected={isDarkMode === false}
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
            {user ? (
              <MenuTrigger>
                <LinkAria
                  // href="/account/profile"
                  className={({ isHovered, isFocusVisible }) =>
                    `p-2 inline-flex flex-col ${isHovered || isFocusVisible ? "outline outline-neutral-300 dark:outline-neutral-200 cursor-pointer" : ""}`
                  }
                >
                  {({ isPressed }) => (
                    <>
                      <span className="welcome text-sm text-center text-[#565959] dark:text-[#a5a8a8]">
                        Welcome {user.first_name}
                      </span>
                      <p className="flex items-center justify-center">
                        <span className="">Account</span>
                        {isPressed ? (
                          <span className="rotate-180 transition-transform duration-200">
                            <IconChevronDown
                              stroke={2.5}
                              size={14}
                              color="#a3a3a3"
                            />
                          </span>
                        ) : (
                          <span className="transition-transform duration-200">
                            <IconChevronDown
                              stroke={2.5}
                              size={14}
                              color="#a3a3a3"
                            />
                          </span>
                        )}
                      </p>
                    </>
                  )}
                </LinkAria>

                <Popover
                  className={
                    "bg-white text-black dark:bg-slate-900 dark:text-white -mt-1 rounded-md border border-gray-300 py-4 px-8"
                  }
                >
                  <Menu
                    className="flex flex-col gap-3 outline-none z-50"
                    aria-label="links"
                  >
                    <MenuItem
                      className={({ isHovered, isFocusVisible }) =>
                        `outline-none w-fit ${isHovered || isFocusVisible ? "underline underline-offset-[6px] cursor-pointer" : ""}`
                      }
                      href="/account"
                    >
                      Account
                    </MenuItem>
                    <MenuItem
                      className={({ isHovered, isFocusVisible }) =>
                        `outline-none w-fit ${isHovered || isFocusVisible ? "underline underline-offset-[6px] cursor-pointer" : ""}`
                      }
                      href={"/account/orders"}
                      routerOptions={{ search: { page: 1 } }}
                    >
                      Order History
                    </MenuItem>
                    {/* <MenuItem
                      className={({ isHovered, isFocusVisible }) =>
                        `outline-none w-fit ${isHovered || isFocusVisible ? "underline underline-offset-[6px] cursor-pointer" : ""}`
                      }
                      href={"/account/myreviews"}
                    >
                      My Reviews
                    </MenuItem> */}
                    <MenuItem
                      className={({ isHovered, isFocusVisible }) =>
                        `outline-none w-fit ${isHovered || isFocusVisible ? "underline underline-offset-[6px] cursor-pointer" : ""}`
                      }
                      onAction={handleSignout}
                    >
                      Sign out
                      <SignOutBtn className="inline" text="" ref={signout2} />
                    </MenuItem>
                  </Menu>
                </Popover>
              </MenuTrigger>
            ) : (
              <LinkAria
                className={({ isHovered, isFocusVisible }) =>
                  `p-2 flex flex-col cursor-pointer ${isHovered || isFocusVisible ? "outline outline-neutral-300 dark:outline-neutral-200" : ""}`
                }
                href="/signin"
                routerOptions={{
                  search: {
                    from: window.location.pathname + window.location.search,
                  },
                }}
              >
                <span className="welcome text-sm text-center text-[#565959] dark:text-[#a5a8a8]">
                  Welcome
                </span>

                <span>Sign In / Register</span>
              </LinkAria>
            )}
          </li>
          {/* /cart */}
          <li className="flex w-[60px] h-[60px] justify-center">
            <Button
              aria-label="Go to cart"
              className={({ isHovered, isFocusVisible }) =>
                `nav-cart px-2 flex-1 relative flex justify-center items-center ${isHovered || isFocusVisible ? "outline outline-neutral-300 dark:outline-neutral-200" : ""}`
              }
              onPress={() =>
                navigate({
                  to: "/cart",
                })
              }
            >
              {cartQuantity > 0 && (
                // <p className="nav-cartItems-number absolute bottom-0 font-bold text-[.75rem] text-neutral-400 dark:text-neutral-300">
                //   <span className="text-orange-500">{cartQuantity}</span>
                //   <span> {cartQuantity > 1 ? "items" : "item"}</span>
                // </p>
                <p className="nav-cartItems-number absolute min-w-[20px] min-h-[20px] text-center p-[2px] aspect-square flex items-center justify-center rounded-full bottom-1 right-2 font-bold text-[.9rem] border border-[#575757] dark:bg-[#282828]">
                  <span className="text-[#ff914d]">{cartQuantity}</span>
                </p>
              )}
              <IconShoppingCart size={34} stroke={1.25} />
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
            <span className="hamburger-icon">Menu[x]</span>
          </Link>
        </li>
        <li className="text-[#CC0C39] dark:text-red-500">
          <Link
            to={"/"}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Best Deals[x]
          </Link>
        </li>
        <li>
          <Link
            to={"/"}
            className="hover:underline hover:underline-offset-8 hover:decoration-2"
          >
            Best Sellers[x]
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
