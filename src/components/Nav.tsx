import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogTrigger,
  Form,
  Header,
  Input,
  Link as LinkAria,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  ModalOverlay,
  Popover,
} from "react-aria-components";
import { Button } from "react-aria-components";
import {
  IconSearch,
  IconX,
  IconShoppingCart,
  IconChevronDown,
  IconMenu2,
  IconUserCircle,
  IconBrightnessFilled,
  IconMoon,
  IconSun,
  IconCheck,
} from "@tabler/icons-react";
import { ThemeContext } from "../context/ThemeContext";
import useAuth from "../hooks/useAuth";
import { trimString } from "../utilities/trimString";
import { SkipLink } from "./ECommerceApp";
import { allLinks, mappedLinks } from "../utilities/NavLinks";
import useSignOut from "../hooks/useSignOut";
import upperFirstLetters from "../utilities/upperFirstLetters";

function Nav() {
  const { cart } = useContext(CartContext);
  const { setTheme } = useContext(ThemeContext);
  const { handleSignOut } = useSignOut();
  // const searchFormSubmit = useRef<HTMLFormElement | null>(null);
  const searchInputElementLg = useRef<HTMLInputElement | null>(null);
  const searchInputElementSm = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [subMenu, setSubMenu] = useState<number | undefined>(undefined);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { user } = useAuth();
  const ulNavList = useRef<HTMLUListElement>(null);
  const ulTheme = useRef<HTMLUListElement>(null);
  // const isDarkMode = Array.from(document.documentElement.classList).includes(
  //   "dark"
  // );

  const trendingLinks = [
    allLinks[mappedLinks.get("bestdeals") || 0],
    allLinks[mappedLinks.get("bestsellers") || 1],
  ];
  const navBarLinks = [
    allLinks[mappedLinks.get("bestdeals") || 0],
    allLinks[mappedLinks.get("bestsellers") || 1],
    allLinks[mappedLinks.get("electronics") || 0],
    allLinks[mappedLinks.get("officeproducts") || 0],
    allLinks[mappedLinks.get("petsupplies") || 0],
    allLinks[mappedLinks.get("garden&outdoors") || 0],
    allLinks[mappedLinks.get("toys&games") || 0],
  ];

  const [localStorageTheme, setLocalStorageTheme] = useState<
    undefined | "light" | "dark" | "auto"
  >(undefined);

  // const signoutBtn = useRef<ChildRef>(null)
  // const signout2 = useRef<LogoutRef>(null);
  const cartQuantity = cart.reduce(
    (prev, curr) => prev + curr.cart_quantity,
    0
  );

  const handleDeleteSearchInput = () => {
    searchInputElementLg?.current?.focus();
    searchInputElementSm?.current?.focus();
    setSearchInput("");
  };
  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.length === 0) {
      return window.location.reload();
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
    setLocalStorageTheme(themeValue);
    setTheme(themeValue);
  };
  // const handleSignout = () => {
  //   if (signout2.current) {
  //     signout2.current.handleSignOut();
  //   }
  // };
  // const searchQuery = new URLSearchParams(window.location.search).get("q");

  useEffect(() => {
    const lsValue = localStorage.getItem("theme");

    if (
      (lsValue !== localStorageTheme && lsValue === "auto") ||
      lsValue === "dark" ||
      lsValue === "light"
    ) {
      setLocalStorageTheme(lsValue);
    }
    if (!showHamburgerMenu) {
      setSubMenu(undefined);
    }
  }, [showHamburgerMenu, localStorageTheme]);

  return (
    <>
      <nav className="px-4 pt-2 md:pt-3 lg:px-6 dark:text-a0d dark:bg-slate-900 border-b dark:border-none">
        <ul className="flex items-center gap-1">
          <SkipLink skipToId="content" skipToText="Skip to Content" />
          <li className="lg:mr-2">
            <div className="menu-btn flex items-center">
              <DialogTrigger
                isOpen={showHamburgerMenu}
                onOpenChange={setShowHamburgerMenu}
              >
                <Button
                  className={({ isHovered, isFocusVisible, isPressed }) =>
                    `lg:p-1 rounded-lg ${isHovered || isPressed || isFocusVisible ? "dark:bg-slate-700 bg-a1s" : ""}`
                  }
                  aria-label="Browse Menu"
                >
                  <IconMenu2 size={32} stroke={1} />
                </Button>
                <ModalOverlay
                  isDismissable={true}
                  className="menu-overlay fixed inset-0"
                >
                  <Modal
                    isDismissable={true}
                    className={
                      "menu-slide ring-0 bg-white dark:bg-a1sd border-r dark:border-r-a3sd min-h-screen absolute top-0 left-0 min-w-[75%] sm:min-w-[365px]"
                    }
                  >
                    <Dialog className="">
                      {({ close }) => (
                        <div>
                          <div className="dark:bg-a0sd dark:border-none dark:text-a0d bg-a0s text-a0 border-b border-b-a2s">
                            <div className="flex justify-between px-4 py-3">
                              <div className="greeting">
                                <Header
                                  slot="title"
                                  className="font-bold text-lg"
                                >
                                  <span>Hello</span>
                                  {user && (
                                    <>
                                      <span className="font-normal">, </span>
                                      <span className="font-normal">
                                        {trimString(
                                          upperFirstLetters(user.first_name),
                                          11
                                        )}
                                      </span>
                                    </>
                                  )}
                                </Header>
                              </div>
                              {!user ? (
                                <div className="signin-announce">
                                  <Button
                                    onPress={() => {
                                      navigate({ to: "/signin" });
                                      close();
                                    }}
                                    className={({
                                      isHovered,
                                      isFocusVisible,
                                      isPressed,
                                    }) =>
                                      `${isHovered || isFocusVisible || isPressed ? "text-a0/70 dark:text-a0d" : ""}`
                                    }
                                  >
                                    Sign in
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  className={"flex lg:hidden"}
                                  onPress={() => {
                                    setShowAccountMenu(true);
                                    close();
                                  }}
                                >
                                  My Account
                                </Button>
                              )}
                            </div>
                          </div>
                          <Button
                            aria-label="Exit Menu"
                            type="button"
                            onPress={close}
                            className={`aspect-square h-[30px] absolute top-2 right-[-50px] z-20`}
                          >
                            <IconX
                              stroke={1}
                              className="mx-auto text-a0d"
                              size={34}
                            />
                          </Button>
                          <ul className="menu-items overflow-y-scroll h-svh pb-[6rem]">
                            <h2 className="px-6 py-2 font-bold text-xl">
                              Trending
                            </h2>
                            {trendingLinks.map((link) => {
                              return (
                                <li key={link.id || link.newId}>
                                  <Button
                                    aria-label={`Go to ${link.label}`}
                                    onPress={() => {
                                      navigate({
                                        to: link.link,
                                        search: link.search,
                                        params: link.params,
                                      });
                                      close();
                                    }}
                                    className={({
                                      isHovered,
                                      isFocusVisible,
                                      isDisabled,
                                      isPressed,
                                    }) =>
                                      `trending-link w-full text-start px-6 py-3 min-w-[120px] ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a3sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2 dark:text-a1d" : ""}`
                                    }
                                  >
                                    {link.label}
                                  </Button>
                                </li>
                              );
                            })}

                            <div className="divider dark:bg-a3sd bg-a2s"></div>
                            <h2 className="px-6 py-3 font-bold text-lg">
                              Shop By Category
                            </h2>
                            <li>
                              <Button
                                aria-expanded={false}
                                onPress={() =>
                                  setSubMenu(subMenu === 2 ? undefined : 2)
                                }
                                className={({
                                  isHovered,
                                  isFocusVisible,
                                  isDisabled,
                                  isPressed,
                                }) =>
                                  `dropdown-item ring-0 outline-0 border-0 flex justify-between w-full px-6 py-3 ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a3sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2 dark:text-a1d" : ""}`
                                }
                              >
                                <span>All Categories</span>
                                <IconChevronDown
                                  stroke={1.25}
                                  className={`dark:text-a0d ${subMenu === 2 ? "[transform:rotate(180deg)] transition-transform duration-500" : "[transform:rotate(0)] transition-transform duration-500"}`}
                                />
                              </Button>
                              <div
                                className={`grid overflow-hidden transition-all ease-in-out duration-300 ${
                                  subMenu === 2
                                    ? "grid-rows-[1fr] opacity-100 py-2"
                                    : "grid-rows-[0fr] opacity-0 py-0 aria-hidden"
                                }`}
                              >
                                <ul className="dropdown-categories overflow-hidden dark:bg-a3sd bg-a0s">
                                  {allLinks.map((linkObj) => {
                                    if (!linkObj.id) {
                                      return;
                                    }
                                    return (
                                      <li key={linkObj.id || linkObj.newId}>
                                        <Button
                                          excludeFromTabOrder={subMenu !== 2}
                                          aria-label={`Go to ${linkObj.label}`}
                                          className={({
                                            isHovered,
                                            isFocusVisible,
                                            isDisabled,
                                            isPressed,
                                          }) =>
                                            `drop-down-item w-full text-start px-10 py-3 min-w-[120px] ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2 dark:text-a1d" : ""}`
                                          }
                                          onPress={() => {
                                            navigate({
                                              to: linkObj.link,
                                              search: linkObj.search,
                                              params: linkObj.params,
                                            });
                                            close();
                                          }}
                                        >
                                          {linkObj.label}
                                        </Button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </li>
                            <div className="divider dark:bg-a3sd bg-a2s"></div>

                            <li className="">
                              <Button
                                aria-expanded={false}
                                onPress={() => {
                                  setSubMenu(subMenu === 1 ? undefined : 1);
                                  setTimeout(() => {
                                    if (ulTheme.current) {
                                      ulTheme.current.scrollIntoView({
                                        block: "start",
                                        inline: "nearest",
                                        behavior: "smooth",
                                      });
                                    }
                                  }, 200);
                                }}
                                className={({
                                  isHovered,
                                  isFocusVisible,
                                  isDisabled,
                                  isPressed,
                                }) =>
                                  `dropdown-item flex justify-between w-full px-6 py-3 ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a3sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2 dark:text-a1d" : ""}`
                                }
                              >
                                <span>Theme</span>
                                <IconChevronDown
                                  stroke={1.25}
                                  className={`dark:text-a0d ${subMenu === 1 ? "[transform:rotate(180deg)] transition-transform duration-500" : "[transform:rotate(0)] transition-transform duration-500"}`}
                                />
                              </Button>
                              <div
                                className={`grid overflow-hidden transition-all ease-in-out duration-300 ${
                                  subMenu === 1
                                    ? "grid-rows-[1fr] opacity-100 py-2"
                                    : "grid-rows-[0fr] opacity-0 py-0 aria-hidden"
                                }`}
                              >
                                <ul
                                  className="overflow-hidden dark:bg-a3sd bg-a0s"
                                  ref={ulTheme}
                                >
                                  <li>
                                    <Button
                                      excludeFromTabOrder={subMenu !== 1}
                                      className={({
                                        isHovered,
                                        isFocusVisible,
                                        isDisabled,
                                        isPressed,
                                      }) =>
                                        `w-full flex text-start items-center gap-1 px-10 py-2 min-w-[120px] ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd/50 bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2 dark:text-a1d" : ""}`
                                      }
                                      isDisabled={localStorageTheme === "auto"}
                                      onPress={() => handleThemeChange("auto")}
                                    >
                                      <IconBrightnessFilled size={22} />
                                      <span className="">OS Default</span>
                                      {localStorageTheme === "auto" && (
                                        <IconCheck
                                          className="ml-auto dark:text-a0d text-a0"
                                          size={20}
                                        />
                                      )}
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      excludeFromTabOrder={subMenu !== 1}
                                      className={({
                                        isHovered,
                                        isFocusVisible,
                                        isDisabled,
                                        isPressed,
                                      }) =>
                                        `w-full flex items-center gap-1 text-start px-10 py-2 min-w-[120px] ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd/50 bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2 dark:text-a1d" : ""}`
                                      }
                                      isDisabled={localStorageTheme === "light"}
                                      onPress={() => handleThemeChange("light")}
                                    >
                                      <IconSun size={22} />
                                      <span>Light</span>
                                      {localStorageTheme === "light" && (
                                        <IconCheck
                                          className="ml-auto dark:text-a0d text-a0"
                                          size={20}
                                        />
                                      )}
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      excludeFromTabOrder={subMenu !== 1}
                                      className={({
                                        isHovered,
                                        isFocusVisible,
                                        isDisabled,
                                        isPressed,
                                      }) =>
                                        `w-full flex items-center gap-1 text-start px-10 py-2 min-w-[120px] ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd/50 bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2 dark:text-a1d" : ""}`
                                      }
                                      isDisabled={localStorageTheme === "dark"}
                                      onPress={() => handleThemeChange("dark")}
                                    >
                                      <IconMoon size={22} />
                                      <span>Dark</span>
                                      {localStorageTheme === "dark" && (
                                        <IconCheck
                                          className="ml-auto dark:text-a0d text-a0"
                                          size={20}
                                        />
                                      )}
                                    </Button>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
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
                  <span className="logo text-xl dark:text-a0d rounded-lg px-2 uppercase items-stretch tracking-wider">
                    Cyber Den
                  </span>
                </div>
              </Link>
            </div>
          </li>
          <li className="hidden flex-1 md:block px-6">
            <div className="search-bar">
              <Form
                onSubmit={handleSearchFormSubmit}
                className={`flex mt-2 md:mt-0 ring-1 ring-a2s mx-auto lg:max-w-[800px] dark:ring-slate-800 rounded-lg relative`}
              >
                <Input
                  ref={searchInputElementLg}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  // autoComplete="off"
                  // autoCorrect="off"
                  // autoCapitalize="off"
                  placeholder="Search Products or Categories"
                  className={
                    "flex-1 h-[40px] md:h-[36px] lg:min-h-[40px] rounded-lg dark:bg-slate-800 py-2 pl-3 pr-20"
                  }
                ></Input>
                <Button
                  type="submit"
                  className={({ isHovered, isFocusVisible }) =>
                    `absolute top-0 bottom-0 right-0 px-2 rounded-r-lg ${isHovered || isFocusVisible ? "dark:bg-slate-500" : "dark:bg-slate-700"}`
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
          </li>
          {/* <li className="hidden lg:flex lg:mr-3">
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
          </li> */}
          <li className="ml-auto flex">
            {user ? (
              <>
                <div className="lg:hidden">
                  <DialogTrigger
                    isOpen={showAccountMenu}
                    onOpenChange={setShowAccountMenu}
                  >
                    <Button
                      className={({ isHovered, isFocusVisible, isPressed }) =>
                        `flex items-center rounded-lg p-1 ${isHovered || isFocusVisible || isPressed ? "bg-a1s dark:bg-slate-700" : ""}`
                      }
                      aria-label="My Account"
                    >
                      <span className="hidden xs:block">
                        {trimString(upperFirstLetters(user.first_name), 12)}
                      </span>
                      <IconUserCircle stroke={1} size={34} />
                      <ModalOverlay
                        isDismissable={true}
                        className="menu-overlay fixed inset-0"
                      >
                        <Modal
                          isDismissable={true}
                          className={
                            "menu-slide-right ring-0 bg-white dark:bg-a1sd border-r dark:border-r-a3sd min-h-screen absolute top-0 right-0 min-w-[75%] sm:min-w-[365px]"
                          }
                        >
                          <Dialog className="">
                            {({ close }) => (
                              <div>
                                <div className="dark:bg-a0sd dark:text-a0d bg-a0s dark:border-none border-b border-b-a2s">
                                  <div className="flex justify-between px-4 py-3">
                                    <div className="heading">
                                      <Header
                                        slot="title"
                                        className="font-bold text-lg"
                                      >
                                        <span>My Account</span>
                                      </Header>
                                    </div>
                                    <div>
                                      <Button
                                        className={"flex"}
                                        aria-label="Browse Menu"
                                        onPress={() => {
                                          setShowHamburgerMenu(true);
                                          close();
                                        }}
                                      >
                                        {"Browse "}
                                        <IconMenu2 stroke={1.5} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  aria-label="Exit Menu"
                                  type="button"
                                  onPress={close}
                                  className={`bg-transparent aspect-square h-[30px] absolute top-2 left-[-50px] z-20`}
                                >
                                  <IconX
                                    stroke={1}
                                    className="mx-auto text-a0d"
                                    size={34}
                                  />
                                </Button>
                                <ul className="account-menu-items overflow-y-scroll h-svh pb-[6rem]">
                                  <li>
                                    <Button
                                      onPress={() => {
                                        navigate({ to: "/account/profile" });
                                        close();
                                      }}
                                      className={({
                                        isHovered,
                                        isFocusVisible,
                                        isDisabled,
                                        isPressed,
                                      }) =>
                                        `dropdown-item ring-0 outline-0 border-0 flex justify-between w-full px-6 py-3 ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2d dark:text-a1d" : ""}`
                                      }
                                    >
                                      <span>Profile</span>
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      onPress={() => {
                                        navigate({
                                          to: "/account/orders",
                                          search: { page: 1 },
                                        });
                                        close();
                                      }}
                                      className={({
                                        isHovered,
                                        isFocusVisible,
                                        isDisabled,
                                        isPressed,
                                      }) =>
                                        `dropdown-item ring-0 outline-0 border-0 flex justify-between w-full px-6 py-3 ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2d dark:text-a1d" : ""}`
                                      }
                                    >
                                      <span>Orders</span>
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      onPress={() => {
                                        navigate({
                                          to: "/account/myreviews",
                                          search: { page: 1 },
                                        });
                                        close();
                                      }}
                                      className={({
                                        isHovered,
                                        isFocusVisible,
                                        isDisabled,
                                        isPressed,
                                      }) =>
                                        `dropdown-item ring-0 outline-0 border-0 flex justify-between w-full px-6 py-3 ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2d dark:text-a1d" : ""}`
                                      }
                                    >
                                      <span>My Reviews</span>
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className={({
                                        isHovered,
                                        isFocusVisible,
                                        isDisabled,
                                        isPressed,
                                      }) =>
                                        `dropdown-item flex justify-between w-full px-6 py-3 ${isHovered || isFocusVisible || isPressed ? "cursor-pointer dark:bg-a2sd bg-a1s outline-0" : isDisabled ? "dark:bg-a3sd bg-a2s text-a2d dark:text-a1d" : ""}`
                                      }
                                      onPress={() => {
                                        close();
                                        handleSignOut();
                                      }}
                                    >
                                      Sign Out
                                    </Button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </Dialog>
                        </Modal>
                      </ModalOverlay>
                    </Button>
                  </DialogTrigger>
                </div>

                <div className="hidden lg:block">
                  <MenuTrigger>
                    <Button
                      // href="/account/profile"
                      className={({ isHovered, isFocusVisible }) =>
                        `p-2 inline-flex flex-col rounded-lg mr-2 ${isHovered || isFocusVisible ? "cursor-pointer bg-a1s dark:bg-slate-700" : ""}`
                      }
                    >
                      {({ isPressed }) => (
                        <>
                          <span className="welcome text-sm text-center text-a1 dark:text-a1d">
                            Welcome,{" "}
                            {trimString(upperFirstLetters(user.first_name), 9)}
                          </span>
                          <p className="flex items-center justify-center text-center w-full">
                            <span className="text-center">Account</span>
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
                    </Button>

                    <Popover
                      className={
                        "bg-a0s outline-none shadow-xl ring-0 dark:bg-slate-800 dark:text-a0d -mt-1 border border-a3s dark:border-slate-600 rounded-lg py-2 px-1"
                      }
                    >
                      <Menu className="flex flex-col z-50" aria-label="links">
                        <MenuItem
                          className={({ isHovered, isFocusVisible }) =>
                            `flex flex-1 p-2 min-w-[120px] rounded-lg ${isHovered || isFocusVisible ? "cursor-pointer bg-a1s dark:bg-slate-600" : ""}`
                          }
                          href="/account/profile"
                        >
                          Profile
                        </MenuItem>
                        <MenuItem
                          className={({ isHovered, isFocusVisible }) =>
                            `flex flex-1 p-2 min-w-[120px] rounded-lg ${isHovered || isFocusVisible ? "cursor-pointer bg-a1s dark:bg-slate-600" : ""}`
                          }
                          href="/account/orders"
                          routerOptions={{ search: { page: 1 } }}
                        >
                          Orders
                        </MenuItem>
                        <MenuItem
                          className={({ isHovered, isFocusVisible }) =>
                            `flex flex-1 p-2 min-w-[120px] rounded-lg ${isHovered || isFocusVisible ? "cursor-pointer bg-a1s dark:bg-slate-600" : ""}`
                          }
                          href="/account/myreviews"
                          routerOptions={{ search: { page: 1 } }}
                        >
                          My Reviews
                        </MenuItem>
                        <MenuItem
                          className={({ isHovered, isFocusVisible }) =>
                            `flex flex-1 p-2 min-w-[120px] rounded-lg ${isHovered || isFocusVisible ? "cursor-pointer bg-a1s dark:bg-slate-600" : ""}`
                          }
                          onAction={handleSignOut}
                        >
                          Sign out
                        </MenuItem>
                      </Menu>
                    </Popover>
                  </MenuTrigger>
                </div>
              </>
            ) : (
              <>
                <div className="lg:hidden">
                  <LinkAria
                    href="/signin"
                    isDisabled={location.pathname === "/signin"}
                    routerOptions={{
                      search: {
                        from: `${location.pathname + (location.search.from ?? "")}`,
                      },
                    }}
                    className={
                      "border border-a2s py-[2px] px-2 rounded-md mr-2 hidden xs:block"
                    }
                  >
                    Sign In
                  </LinkAria>
                </div>
                <div className="hidden lg:block">
                  <LinkAria
                    className={({ isHovered, isFocusVisible }) =>
                      `p-2 inline-flex outline-none flex-col rounded-lg mr-2 ${isHovered || isFocusVisible ? "cursor-pointer bg-a1s dark:bg-slate-700" : ""}`
                    }
                    href="/signin"
                    routerOptions={{
                      search: {
                        from: location.pathname + (location.search.from ?? ""),
                      },
                    }}
                  >
                    <span className="welcome text-sm text-center text-a1 dark:text-a1d">
                      Welcome
                    </span>

                    <span>Sign In / Register</span>
                  </LinkAria>
                </div>
              </>
            )}
          </li>
          <li className="flex">
            <div className="flex">
              <LinkAria
                aria-label="Go to cart"
                className={({ isHovered, isFocusVisible, isPressed }) =>
                  `nav-cart flex-1 p-1 lg:p-3 rounded-lg relative flex justify-center items-center ${isHovered || isFocusVisible || isPressed ? "bg-a1s dark:bg-slate-700 outline-0 border-0 ring-0" : ""}`
                }
                href="/cart"
              >
                {cartQuantity > 0 && (
                  <p className="nav-cartItems-number absolute min-w-[20px] min-h-[20px] text-center p-[2px] aspect-square flex items-center justify-center rounded-full bottom-0 right-0 lg:bottom-1 lg:right-1 font-bold text-[.9rem] dark:border dark:border-[#575757] dark:bg-[#282828]">
                    <span className="text-[#ff914d]">{cartQuantity}</span>
                  </p>
                )}
                <IconShoppingCart size={34} stroke={1} />
              </LinkAria>
            </div>
          </li>
        </ul>
        <div className="md:hidden">
          <div className="search-bar">
            <Form
              onSubmit={handleSearchFormSubmit}
              className={`flex mt-2 md:mt-0 ring-1 ring-a2s mx-auto lg:max-w-[800px] dark:ring-slate-800 rounded-lg relative`}
            >
              <Input
                value={searchInput}
                ref={searchInputElementSm}
                onChange={(e) => setSearchInput(e.target.value)}
                // autoComplete="off"
                // autoCorrect="off"
                // autoCapitalize="off"
                placeholder="Search Products or Categories"
                className={
                  "flex-1 h-[40px] md:h-[36px] lg:min-h-[40px] rounded-lg dark:bg-slate-800 py-2 pl-3 pr-20"
                }
              ></Input>
              <Button
                type="submit"
                className={({ isHovered, isFocusVisible }) =>
                  `absolute top-0 bottom-0 right-0 px-2 rounded-r-lg ${isHovered || isFocusVisible ? "dark:bg-slate-500" : "dark:bg-slate-700"}`
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
        </div>

        <ul
          className="nav-category-links overflow-x-scroll py-1 flex text-nowrap gap-4 px-1 pb-1 mt-2 justify-around"
          ref={ulNavList}
        >
          {navBarLinks.map((link, index) => {
            return (
              <li key={link.id || index} className="flex">
                <Link
                  to={link.link}
                  search={link.search}
                  params={link.params}
                  className={`hover:opacity-80 active:opacity-80 py-1 ${index === 0 && "text-[#DB1600] dark:text-[#FF230A] font-bold"}`}
                >
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default Nav;
