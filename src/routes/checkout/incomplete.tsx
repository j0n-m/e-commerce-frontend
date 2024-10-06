import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/incomplete")({
  component: () => (
    <div className="max-w-[1500px] mx-auto p-4">
      <h2 className="text-center text-2xl font-bold">
        Payment canceled. You must be signed in to complete your order.
      </h2>
      <br />
      <p className="text-center text-lg">
        <Link
          className="text-blue-700 dark:text-blue-400"
          to="/"
          replace={true}
        >
          Click here to return to home.
        </Link>
      </p>
    </div>
  ),
});
