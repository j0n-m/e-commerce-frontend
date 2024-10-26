import { useEffect, useState } from "react";
import ReviewForm, { ratingValues } from "../components/ReviewForm";
import { RatingValues } from "../components/ReviewForm";
import useAuth from "../hooks/useAuth";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import fetch from "../utilities/fetch";
import { AxiosError, AxiosResponse } from "axios";
import { queryClient } from "../App";
import {
  orderHistoryByUserQuery,
  singleProductQueryOption,
} from "../routes/shop/product/$productId";
import { ProductType } from "../types/ProductType";
import noProductImage from "../assets/images/no_product_image.jpg";
import { trimString } from "../utilities/trimString";

const route = getRouteApi("/shop/product/$productId/create-review");

const FormSuccess = () => {
  return (
    <main className="flex-1" autoFocus={true}>
      <div className="max-w-[500px] mx-auto mt-6 bg-white dark:bg-[#212121] border border-[#e6e6e6] dark:border-[#30313D] p-4">
        <h1 className="text-2xl font-bold">Thank you!</h1>
        <p className="mt-2">
          <span className="text-lg">
            Successfully submitted your product review.
          </span>
        </p>
        <Link
          to="/"
          replace={true}
          className="text-blue-400 hover:underline focus-visible:underline underline-offset-2"
        >
          Return home
        </Link>
      </div>
    </main>
  );
};

function useProduct({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const data = useSuspenseQuery(singleProductQueryOption(productId)).data;
  const productData = data.product as ProductType;
  const product = productData;

  const lastOrderData = useSuspenseQuery(
    orderHistoryByUserQuery(userId, productId)
  ).data.data;
  const lastPurchaseDate = lastOrderData.order_history[0].order_date as string;
  return { product, lastPurchaseDate };
}

function CreateReview() {
  //get auth for reviewerName and reviewer
  const { user } = useAuth();
  const params = route.useParams();
  const [rating, setRating] = useState<RatingValues | undefined>(undefined);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDesc, setReviewDesc] = useState("");
  // const [reviewDate, setReviewDate] = useState<undefined | Date>(undefined);
  // const [reviewEditDate, setReviewEditDate] = useState<undefined | Date>(
  //   undefined
  // );
  const [productId, setProductId] = useState(params.productId);
  const [reviewer, setReviewer] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [validationError, setValidationError] = useState<
    undefined | { [index: string]: string }
  >(undefined);
  const [globalError, setGlobalError] = useState<string[]>([]);
  const navigate = useNavigate();
  const userCache = queryClient.getQueryData(["auth"]) as AxiosResponse;
  const { product, lastPurchaseDate } = useProduct({
    productId: params.productId,
    userId: user?.id || userCache?.data?.user.id,
  });

  const createReview = useMutation({
    mutationKey: ["createReview"],
    mutationFn: async () =>
      await fetch.post(
        "api/reviews",
        {
          rating,
          reviewer,
          reviewer_name: reviewerName,
          review_title: reviewTitle,
          review_description: reviewDesc,
          product_id: productId,
        },
        { withCredentials: true }
      ),
    onError: async (error) => {
      const response = (error as AxiosError).response;
      if (response?.status == 401) {
        await navigate({
          to: "/signin",
          search: { from: location.pathname },
        });
      } else if (response?.status == 403) {
        setGlobalError([response.statusText]);
      } else {
        if (response?.data) {
          const errorArr = (
            response.data as Partial<{ error: any[] }>
          ).error?.map((e) => e.msg);
          setGlobalError([
            ...(errorArr ||
              "An internal error occurred. Please try again later."),
          ]);
        } else {
          setGlobalError([
            "An internal error occurred. Please try again later.",
          ]);
        }
      }
    },
    onSuccess: async (data) => {
      const response = data;
      const reviewId = response.data.id as string;
      "success", response;
      await queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["product"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orderhistory"],
      });
      await navigate({ to: `/shop/review/${reviewId}`, replace: true });
      scrollTo({ top: 0 });
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = () => {
      if (rating === undefined || !ratingValues.includes(rating)) {
        setValidationError({
          ratings: "Please select a rating for this product.",
        });
        return false;
      }
      if (!productId || !reviewerName || !reviewer) {
        setGlobalError([
          "The form encountered an error while filling the form. Please try again later.",
        ]);
        return false;
      }
      return true;
    };
    if (!isFormValid()) {
      ("form not valid");
      return;
    }
    createReview.mutate();
  };

  useEffect(() => {
    const sendToSignin = async () => {
      await navigate({ to: "/signin", replace: true });
    };
    if (!reviewerName && user) {
      setReviewerName(`${user.first_name} ${user.last_name}`);
      setReviewer(user?.id);
    }
    if (!user) {
      sendToSignin();
    }
  }, [reviewerName, user, createReview.isPending]);

  if (createReview.isSuccess) {
    return <FormSuccess></FormSuccess>;
  }
  return (
    <main className="p-4">
      <div className="product-details max-w-[500px] mx-auto flex gap-2 mb-4">
        <div className="details-left">
          <img
            src={product.image_src || noProductImage}
            alt={product.image_src ? product.name : "No image available"}
            className="max-w-[100px] max-h-[100px] aspect-auto"
          />
        </div>
        <div className="details-right">
          <Link
            to={`/shop/product/$productId`}
            params={{ productId }}
            className="hover:underline"
          >
            <span>{trimString(product.name, 75)}</span>
          </Link>
          <p>
            <span className="text-slate-400">${product.price.toFixed(2)}</span>
          </p>
          <p>
            <span className="text-slate-400">
              Last Purchased: {new Date(lastPurchaseDate).toDateString()}
            </span>
          </p>
        </div>
      </div>

      {reviewerName && (
        <ReviewForm
          handleFormSubmit={handleFormSubmit}
          formTitle="Create a review"
          validationError={validationError}
          setValidationError={setValidationError}
          rating={rating}
          setRating={setRating}
          reviewTitle={reviewTitle}
          setReviewTitle={setReviewTitle}
          reviewerName={reviewerName}
          setReviewerName={setReviewerName}
          reviewDesc={reviewDesc}
          setReviewDesc={setReviewDesc}
          formIsInvalid={createReview.isPending}
        />
      )}
      {globalError.length > 0 && (
        <div className="text-center text-red-500 mt-2 text-lg">
          <ul>
            {globalError.map((v, i) => (
              <li key={i}>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

export default CreateReview;
