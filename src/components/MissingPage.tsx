import { Link } from "@tanstack/react-router";
import React from "react";

function MissingPage() {
  return (
    <div className="mx-auto max-w-[700px] text-center my-8">
      <h1 className="font-medium text-6xl">404</h1>
      <p className="font-medium text-3xl">Page Not Found</p>
      <p className="mt-4">
        <Link
          to="/"
          className="text-purple-600 text-lg dark:text-blue-300 hover:underline underline-offset-2"
        >
          Return home
        </Link>
      </p>
    </div>
  );
}

export default MissingPage;
