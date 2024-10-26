import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { ShopURLQuery } from "../routes/shop/category/$categoryId";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  isLargeScreenSize: boolean;
  searchDeps: ShopURLQuery;
  navigateLink?: string;
  navigateSearch?: { [index: string]: string };
  className?: string;
};
type PaginationBtnProps = {
  searchDeps: ShopURLQuery;
  isDisabled?: boolean;
  navigateLink?: string;
  children?: ReactNode;
  className?: string;
};
function PaginationBtn({
  searchDeps,
  navigateLink = ".",
  children,
  isDisabled = false,
  className,
}: PaginationBtnProps) {
  return (
    <Link
      to={navigateLink}
      search={searchDeps}
      disabled={isDisabled}
      className={`${className && className}`}
    >
      <span>{children}</span>
    </Link>
  );
}

export function PaginationBar({
  totalPages,
  currentPage,
  navigateLink = ".",
  searchDeps,
  navigateSearch,
  isLargeScreenSize,
  className,
}: PaginationProps) {
  const firstPage = 1;
  const lastPage = totalPages;

  let leftSiblings: number[] = [];
  const rightSiblings: number[] = [];

  let leftSiblingLength: number;
  let rightSiblingLength: number;
  if (isLargeScreenSize) {
    leftSiblingLength = 3;
    rightSiblingLength = 3;
  } else {
    leftSiblingLength = 0;
    rightSiblingLength = 0;
  }

  for (
    let i = currentPage - 1;
    leftSiblings.length < leftSiblingLength && i > 1;
    i--
  ) {
    leftSiblings.push(i);
  }

  if (
    leftSiblings.length > 0 &&
    leftSiblings[leftSiblings.length - 1] - 1 > 1
  ) {
    leftSiblings.push(-1);
  }
  leftSiblings = leftSiblings.reverse();
  for (
    let j = currentPage + 1;
    rightSiblings.length < rightSiblingLength && j < lastPage;
    j++
  ) {
    rightSiblings.push(j);
  }
  if (rightSiblings.length > 0 && rightSiblings[0] + 1 < lastPage) {
    rightSiblings.push(-1);
  }
  // (leftSiblings, rightSiblings);

  return (
    <div className={`pagination-bar my-4 ${className ? className : ""}`}>
      <div className="pagination-container flex flex-col items-center lg:flex-row border border-[#e6e6e6] dark:border-[#30313D] rounded-md">
        <p className="text-center px-4 flex items-center lg:pb-0">
          <span className="">
            Page {currentPage} of {totalPages}
          </span>
        </p>
        <nav className="pagination-btns flex rounded-md border-t lg:border-t-0">
          <ul className="flex">
            <li>
              <Link
                disabled={currentPage <= firstPage}
                rel="prev"
                className={`min-w-[90px] h-[40px] flex justify-center dark:border-r-[#2e2e2e] border-r-[0.5px] ${currentPage <= firstPage ? "bg-neutral-300 text-neutral-500 dark:bg-gray-900" : "hover:bg-a1s focus:bg-a1s dark:hover:dark:bg-a3sd dark:focus:dark:bg-[#2e2e2e] focus:outline-offset-[-1px]"}`}
                to={navigateLink}
                search={
                  navigateSearch || { ...searchDeps, page: currentPage - 1 }
                }
              >
                <span className="flex w-full items-center justify-center">
                  <IconChevronLeft height={24} width={18} />
                  Prev
                </span>
              </Link>
            </li>
            {leftSiblingLength !== 0 || currentPage === firstPage ? (
              <li>
                <PaginationBtn
                  isDisabled={currentPage === firstPage}
                  searchDeps={{ ...searchDeps, page: firstPage }}
                  className={`inline-flex min-w-[24px] h-[40px] px-4 items-center justify-center ${currentPage === firstPage ? "font-bold rounded-sm" : "hover:bg-a1s dark:hover:bg-gray-600"}`}
                >
                  {firstPage.toString()}
                </PaginationBtn>
              </li>
            ) : null}

            {leftSiblings.map((value, index) => {
              if (value === -1) {
                return (
                  <li key={index}>
                    <span
                      className={`pagination-btn inline-flex min-w-[16px] h-[40px] px-1 items-center justify-center`}
                    >
                      {"..."}
                    </span>
                  </li>
                );
              }
              return (
                <li key={index}>
                  <PaginationBtn
                    searchDeps={{ ...searchDeps, page: +value }}
                    className={`pagination-btn inline-flex min-w-[24px] h-[40px] px-4 items-center justify-center ${currentPage === +value ? "font-bold -outline-offset-[1.5px] rounded-sm" : "hover:bg-a1s dark:hover:bg-gray-600"}`}
                  >
                    {value.toString()}
                  </PaginationBtn>
                </li>
              );
            })}
            {currentPage !== firstPage ? (
              <li>
                <PaginationBtn
                  isDisabled={true}
                  className={`pagination-btn inline-flex min-w-[24px] h-[40px] px-4 items-center justify-center ${currentPage === searchDeps.page ? "font-bold -outline-offset-[1.5px] rounded-sm" : "hover:bg-a1s"}`}
                  searchDeps={searchDeps}
                >
                  {currentPage.toString()}
                </PaginationBtn>
              </li>
            ) : null}

            {rightSiblings.map((value, index) => {
              if (value === -1) {
                return (
                  <li key={index}>
                    <span
                      className={`pagination-btn inline-flex min-w-[16px] h-[40px] px-1 items-center justify-center`}
                    >
                      {"..."}
                    </span>
                  </li>
                );
              }
              return (
                <li key={index}>
                  <PaginationBtn
                    className={`pagination-btn inline-flex min-w-[24px] h-[40px] px-4 items-center justify-center ${currentPage === value ? "font-bold -outline-offset-[1.5px] rounded-sm" : "hover:bg-a1s dark:hover:bg-gray-600"}`}
                    searchDeps={{ ...searchDeps, page: +value }}
                  >
                    {value.toString()}
                  </PaginationBtn>
                </li>
              );
            })}

            {isLargeScreenSize && currentPage !== lastPage ? (
              <li>
                <PaginationBtn
                  isDisabled={currentPage === lastPage}
                  className={`inline-flex min-w-[24px] h-[40px] px-4 items-center justify-center ${currentPage === lastPage ? "font-bold -outline-offset-[1.5px] rounded-sm" : "hover:bg-a1s dark:hover:bg-gray-600"}`}
                  searchDeps={{ ...searchDeps, page: lastPage }}
                >
                  {lastPage.toString()}
                </PaginationBtn>
              </li>
            ) : null}

            <li>
              <Link
                disabled={currentPage >= lastPage}
                className={`min-w-[90px] h-[40px] flex justify-center border-l-neutral-200 dark:border-l-amenusd border-l-[0.5px] ${currentPage >= lastPage ? "text-neutral-500 bg-neutral-300 dark:bg-gray-900" : "hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-a3sd dark:focus:bg-a3sd focus:outline-offset-[-1px]"}`}
                to={navigateLink}
                rel="next"
                search={
                  navigateSearch || { ...searchDeps, page: currentPage + 1 }
                }
              >
                <span className="flex w-full h-full items-center justify-center">
                  Next
                  <IconChevronRight width={18} height={24} />
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
