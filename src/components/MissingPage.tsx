import { Link } from "@tanstack/react-router";
import React from "react";

function MissingPage() {
  return (
    <div className="mx-auto max-w-[700px] text-center my-8">
      <h1 className="font-medium text-6xl">404</h1>
      <p className="font-medium text-2xl">Page Not Found</p>
      <p className="mt-4">
        <Link
          to="/"
          className="underline text-purple-600 text-lg dark:text-blue-300"
        >
          Click here to return back to the home page
        </Link>
      </p>
    </div>
  );
}

export default MissingPage;
