import { ReactNode } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const arr = (() => {
  const newArr = [];
  for (let i = 0; i < 20; i++) {
    newArr.push(i);
  }
  return newArr;
})();
type LoadingComponentProps = {
  children?: ReactNode;
};
function LoadingComponent({ children }: LoadingComponentProps) {
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const ls = localStorage.getItem("theme");
  const theme = ls === "light" ? "light" : preferDark ? "dark" : "light";

  //by default component loads as general loading unless passed a prop "children" of a custom loading
  return (
    <>
      {theme === "light" && children ? (
        <SkeletonTheme baseColor="#eeeeee" highlightColor="#fafafa">
          {children}
        </SkeletonTheme>
      ) : theme === "light" && !children ? (
        <SkeletonTheme baseColor="#eeeeee" highlightColor="#fafafa">
          <div className="px-2 py-4">
            <div className="">
              <Skeleton height={"1.7rem"} width={"180px"}></Skeleton>
            </div>
            <div className="my-3">
              <Skeleton height={"45px"}></Skeleton>
            </div>
            <div className="flex flex-col gap-2 lg:hidden">
              {arr.map((n) => (
                <Skeleton key={n} height={"170px"} width={"100%"}></Skeleton>
              ))}
            </div>
            <div className="hidden lg:flex flex-wrap gap-2">
              {arr.map((n) => (
                <div
                  key={n}
                  className="card lg:w-[calc(100%/5-8px)] xl:w-[calc(100%/6-8px)]"
                >
                  <Skeleton height={"458px"} width={"100%"}></Skeleton>
                </div>
              ))}
            </div>
          </div>
        </SkeletonTheme>
      ) : theme === "dark" && children ? (
        <SkeletonTheme baseColor="#333333" highlightColor="#4d4d4d">
          {children}
        </SkeletonTheme>
      ) : (
        <SkeletonTheme baseColor="#333333" highlightColor="#4d4d4d">
          <div className="px-2 py-4">
            <div className="">
              <Skeleton height={"1.7rem"} width={"180px"}></Skeleton>
            </div>
            <div className="my-3">
              <Skeleton height={"45px"}></Skeleton>
            </div>
            <div className="flex flex-col gap-2 lg:hidden">
              {arr.map((n) => (
                <Skeleton key={n} height={"170px"} width={"100%"}></Skeleton>
              ))}
            </div>
            <div className="hidden lg:flex flex-wrap gap-2">
              {arr.map((n) => (
                <div
                  key={n}
                  className="card lg:w-[calc(100%/5-8px)] xl:w-[calc(100%/6-8px)]"
                >
                  <Skeleton height={"458px"} width={"100%"}></Skeleton>
                </div>
              ))}
            </div>
          </div>
        </SkeletonTheme>
      )}
    </>
  );
}

function LoadingComponent_Home() {
  return (
    <div className="m-2">
      <Skeleton height={"33svh"}></Skeleton>
      <div className="my-3">
        <Skeleton height={"1.5rem"} width={"175px"}></Skeleton>
      </div>
      <div className="flex flex-wrap gap-2 w-full">
        {[1, 2, 3, 4, 5].map((num) => {
          return (
            <div
              key={num}
              className="card w-[calc(100%/1-8px)] xs:w-[calc(100%/2-8px)] md:w-[calc(100%/3-8px)] lg:w-[calc(100%/5-8px)]"
            >
              <Skeleton height={"300px"}></Skeleton>
            </div>
          );
        })}
      </div>
      <div className="my-3">
        <Skeleton height={"1.5rem"} width={"175px"}></Skeleton>
      </div>
      <div className="flex flex-wrap gap-2 w-full">
        {[1, 2, 3, 4, 5].map((num) => {
          return (
            <div
              key={num}
              className="card w-[calc(100%/1-8px)] xs:w-[calc(100%/2-8px)] md:w-[calc(100%/3-8px)] lg:w-[calc(100%/5-8px)]"
            >
              <Skeleton height={"300px"}></Skeleton>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LoadingComponent;
export { LoadingComponent_Home };
