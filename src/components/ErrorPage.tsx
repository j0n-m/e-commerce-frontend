import { AxiosError } from "axios";
import { CatchBoundary } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";
import { IconBug } from "@tabler/icons-react";

function ErrorPage({
  error,
}: {
  error: Error | AxiosError;
  reset?: () => void;
}) {
  const errorObj = Object.assign({}, error) as AxiosError;
  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  const isResponseError = !!errorObj?.response;
  console.log(isResponseError, errorObj);

  useEffect(() => {
    // Reset the query error boundary
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <CatchBoundary
      onCatch={(error) => console.error("testing", error)}
      getResetKey={() => "reset"}
    >
      <main className="mt-4 flex-1">
        <div className="py-6">
          <header className="flex items-center justify-center gap-2">
            <div className="icon">
              <IconBug size={70} color="#89cff0"></IconBug>
            </div>
            <div className="title">
              <h1 className="text-3xl lg:text-[42px] font-bold flex flex-col">
                <span>Something went wrong</span>
              </h1>
            </div>
          </header>
          <div>
            <p className="text-lg text-center mt-3">
              {isResponseError
                ? errorObj.response?.statusText
                : errorObj?.message
                  ? errorObj.message
                  : "An unexpected error occured."}
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="outline block max-w-max rounded-lg dark:outline-a3sd px-3 py-2 dark:bg-a1sd mx-auto hover:dark:bg-a2sd"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
        {/* <p className="text-center font-semibold text-lg mt-4">
          {errorObj.response
            ? `Error ${errorObj.response?.status} - ${errorObj.response?.statusText}`
            : errorObj.message
              ? `Error occurred, ${errorObj.message}`
              : `Failed loading resources.`}
        </p> */}
      </main>
    </CatchBoundary>
  );
}

export default ErrorPage;
