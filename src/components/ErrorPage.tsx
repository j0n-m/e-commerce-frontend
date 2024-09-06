import { AxiosError } from "axios";
import { CatchBoundary } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";

function ErrorPage({
  error,
}: {
  error: Error | AxiosError;
  reset?: () => void;
}) {
  const errorObj = Object.assign({}, error) as AxiosError;
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    // Reset the query error boundary
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <CatchBoundary
      onCatch={(error) => console.error("testing", error)}
      getResetKey={() => "reset"}
    >
      <div>
        <p className="text-center font-semibold text-lg mt-4">
          {errorObj.response
            ? `Error ${errorObj.response?.status} - ${errorObj.response?.statusText}`
            : errorObj.message
              ? `Error occurred, ${errorObj.message}`
              : `Failed loading resources.`}
        </p>
      </div>
    </CatchBoundary>
  );
}

export default ErrorPage;
