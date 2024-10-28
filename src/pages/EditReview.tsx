import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { singleReviewQueryOption } from "../routes/shop/review/$reviewId_/edit";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import {
  ratingValues,
  RatingValues,
  ReviewRatingBtns,
} from "../components/ReviewForm";
import { trimString } from "../utilities/trimString";
import { ReviewType } from "../types/ReviewType";
import noProductImage from "../assets/images/no_product_image.jpg";
import {
  Button,
  Dialog,
  DialogTrigger,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  TextArea,
  TextField,
} from "react-aria-components";
import useAuth from "../hooks/useAuth";
import isAuthenticated from "../utilities/isAuthenticated";
import fetch from "../utilities/fetch";
import { queryClient } from "../App";

const route = getRouteApi("/shop/review/$reviewId/edit");
export function useReview({ reviewId }: { reviewId: string }) {
  const reviewData = useSuspenseQuery(singleReviewQueryOption(reviewId)).data
    .data;
  const review = reviewData.review as ReviewType;
  return review;
}
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
function EditReview() {
  const { user } = useAuth();
  const { reviewId } = route.useParams();
  const review = useReview({ reviewId });
  const [rating, setRating] = useState<RatingValues | undefined>(review.rating);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewTitle, setReviewTitle] = useState(review.review_title);
  const [reviewDesc, setReviewDesc] = useState(review.review_description);
  // const [reviewDate, setReviewDate] = useState<undefined | Date>(undefined);
  // const [reviewEditDate, setReviewEditDate] = useState<undefined | Date>(
  //   undefined
  // );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [productId, setProductId] = useState(review.product_id._id);
  const [reviewer, setReviewer] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [validationError, setValidationError] = useState<
    undefined | { [index: string]: string }
  >(undefined);
  const [globalError, setGlobalError] = useState<string[]>([]);
  const navigate = useNavigate();
  const [enableSave, setEnableSave] = useState(false);

  const deleteReviewMutation = useMutation({
    mutationKey: ["deleteReview", { id: reviewId }],
    mutationFn: async () => {
      return fetch.delete(`api/review/${reviewId}`, { withCredentials: true });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["review"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["category"],
      });
      await navigate({
        to: "/account/myreviews",
        search: { page: 1 },
        replace: true,
      });
    },
    onError: async (error) => {
      setGlobalError([
        "An error occured while trying to delete this review.",
        error.message,
      ]);
      console.error(error);
    },
  });
  const saveReviewMutation = useMutation({
    mutationKey: ["saveReview", { id: reviewId }],
    mutationFn: async () => {
      return await fetch.put(
        `api/review/${reviewId}`,
        {
          rating,
          reviewer_name: reviewerName,
          review_title: reviewTitle,
          review_description: reviewDesc,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["reviews", { id: productId }],
      });
      await queryClient.invalidateQueries({
        queryKey: ["review"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["category"],
      });
      await navigate({
        to: "/shop/review/$reviewId",
        params: { reviewId },
        replace: true,
      });
    },
    onError: async (error) => {
      setGlobalError([
        "An error occured while trying to save this review.",
        error.message,
      ]);
      console.error(error);
    },
  });

  const handleDeleteReview = () => {
    deleteReviewMutation.mutate();
  };
  const handleSaveReview = () => {
    saveReviewMutation.mutate();
  };
  const handleReviewDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const profanityMatches = matcher.getAllMatches(e.target.value, true);
    if (validationError?.review_description) {
      setValidationError(undefined);
    }
    if (profanityMatches.length) {
      for (const match of profanityMatches) {
        const { phraseMetadata } =
          englishDataset.getPayloadWithPhraseMetadata(match);
        console.log(
          `Match for word ${phraseMetadata?.originalWord} is not allowed.`
        );
        setValidationError({
          review_description: `Match for word ${phraseMetadata?.originalWord} is not allowed.`,
        });
      }
    }
    setReviewDesc(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid = () => {
      const profanityMatches = matcher.getAllMatches(reviewDesc, true);
      const profanityMatches_title = matcher.getAllMatches(reviewTitle, true);
      if (profanityMatches.length) {
        for (const match of profanityMatches) {
          const { phraseMetadata } =
            englishDataset.getPayloadWithPhraseMetadata(match);

          setValidationError({
            review_description: `Match for word ${phraseMetadata?.originalWord} is not allowed.`,
          });
        }
        return false;
      }
      if (profanityMatches_title.length) {
        for (const match of profanityMatches_title) {
          const { phraseMetadata } =
            englishDataset.getPayloadWithPhraseMetadata(match);

          setValidationError({
            review_title: `Match for word ${phraseMetadata?.originalWord} is not allowed.`,
          });
        }
        return false;
      }
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
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        await navigate({
          to: "/signin",
          replace: true,
          search: { from: window.location.pathname },
        });
        return false;
      } else {
        return true;
      }
    };

    if (!isFormValid()) {
      return;
    }
    const validAuth = await checkAuth();
    if (validAuth) {
      handleSaveReview();
    }
  };

  // return <p>edit review</p>;
  useEffect(() => {
    if (user && !reviewer) {
      setReviewer(user.id);
      setReviewerName(`${user.first_name} ${user.last_name}`);
    }
  }, [user, reviewer]);
  useEffect(() => {
    if (
      rating !== review.rating ||
      reviewTitle !== review.review_title ||
      reviewDesc !== review.review_description
    ) {
      setEnableSave(true);
    }
  }, [rating, reviewTitle, reviewDesc]);

  return (
    <main className="p-4">
      <div className="product-details max-w-[500px] mx-auto flex gap-2 mb-4">
        <div className="details-left">
          <img
            src={review.product_id.image_src || noProductImage}
            alt={
              review.product_id.image_src
                ? review.product_id.name
                : "No image available"
            }
            className="max-w-[100px] max-h-[100px] aspect-auto"
          />
        </div>
        <div className="details-right">
          <Link
            to={`/shop/product/$productId`}
            params={{ productId }}
            className="hover:underline"
          >
            <span>{trimString(review.product_id.name, 75)}</span>
          </Link>
          <p>
            <span className="text-slate-400">
              ${review.product_id.price.toFixed(2)}
            </span>
          </p>
          <p>
            <span className="text-slate-400">
              Last Reviewed:{" "}
              {review.review_edit_date
                ? new Date(review.review_edit_date).toDateString()
                : new Date(review.review_date).toDateString()}
            </span>
          </p>
        </div>
      </div>

      {reviewer && (
        <Form
          onSubmit={handleFormSubmit}
          validationErrors={validationError}
          className="flex flex-col gap-2 max-w-[500px] mx-auto"
        >
          <h1 className="font-bold text-2xl mb-2">Edit review form</h1>
          <TextField
            name="reviewer_name"
            isRequired
            className={"flex flex-col gap-1"}
          >
            <Label>Reviewer Name</Label>
            <Input
              value={reviewerName || "No name provided"}
              className={`dark:text-slate-400 p-2 rounded-lg dark:bg-slate-800`}
              disabled
              readOnly
            />
            <FieldError className={`text-red-500 mt-2`} />
          </TextField>
          <div className="rating-container">
            <TextField name="ratings">
              <Label id="ratings">Product rating</Label>

              <div className="flex items-start gap-3 mt-1">
                {ratingValues.map((value) => {
                  if (value == 1 || value == 5) {
                    const ratingLabel = {
                      1: "Poor",
                      5: "Great",
                    };
                    return (
                      <div key={value}>
                        <ReviewRatingBtns
                          value={value}
                          validationError={validationError}
                          setValidationError={setValidationError}
                          setRating={setRating}
                          rating={rating}
                        />
                        <p className="text-center dark:text-slate-400">
                          <span>{ratingLabel[value]}</span>
                        </p>
                      </div>
                    );
                  }
                  return (
                    <ReviewRatingBtns
                      key={value}
                      validationError={validationError}
                      setValidationError={setValidationError}
                      value={value}
                      setRating={setRating}
                      rating={rating}
                    />
                  );
                })}
              </div>
              <FieldError className={`text-red-500 mt-2`} />
            </TextField>
          </div>
          <TextField
            name="review_title"
            isRequired
            className={"flex flex-col gap-1"}
          >
            <Label>Review Title</Label>
            <Input
              value={reviewTitle}
              minLength={2}
              className={`dark:text-slate-100 p-2 rounded-lg dark:bg-slate-800`}
              onChange={(e) => setReviewTitle(e.target.value)}
            />
            <FieldError className={`text-red-500 mt-2`} />
          </TextField>
          <TextField
            name="review_description"
            minLength={2}
            className={"flex flex-col gap-1"}
            isRequired
          >
            <Label>Review Description</Label>
            <TextArea
              value={reviewDesc}
              spellCheck="true"
              onChange={(e) => handleReviewDesc(e)}
              rows={5}
              className={`dark:text-slate-100 py-1 px-2 rounded-lg dark:bg-slate-800`}
            ></TextArea>
            <FieldError className={`text-red-500 mt-2`} />
          </TextField>
          <Button
            type="submit"
            isDisabled={
              !enableSave ||
              saveReviewMutation.isPending ||
              saveReviewMutation.isSuccess
            }
            className={({ isHovered, isFocusVisible, isDisabled }) =>
              `text-black px-3 py-2 rounded-sm text-lg mt-2 ${isHovered || isFocusVisible ? "bg-[#ff841f]" : isDisabled ? "bg-gray-400" : "bg-orange-400"}`
            }
          >
            Save changes
          </Button>

          <DialogTrigger>
            <Button
              type="button"
              className={({ isHovered, isFocusVisible, isDisabled }) =>
                `text-black px-3 py-2 rounded-sm text-lg mt-2 ${isHovered || isFocusVisible ? "bg-red-500" : isDisabled ? "bg-gray-400" : "bg-red-400"}`
              }
            >
              Delete Review
            </Button>
            <ModalOverlay
              isDismissable
              className={"fixed inset-0 backdrop-blur-sm bg-[rgba(0,0,0,0.6)]"}
            >
              <Modal
                isDismissable
                className={
                  "fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] max-w-[500px] bg-white dark:bg-slate-800 dark:border-slate-700 py-6 px-6 rounded-lg"
                }
              >
                <Dialog className="" role="alertdialog">
                  {({ close }) => (
                    <>
                      <Heading className="text-xl font-bold" slot="title">
                        Delete this review?
                      </Heading>
                      <div className="modal-message">
                        <p className="mt-2">
                          This will permanently delete the selected review:
                        </p>
                        <p className="mt-2">Continue?</p>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <Button
                          onPress={close}
                          className={"border px-3 py-1 rounded-md"}
                          autoFocus
                        >
                          Cancel
                        </Button>
                        <Button
                          onPress={handleDeleteReview}
                          isDisabled={
                            deleteReviewMutation.isPending ||
                            deleteReviewMutation.isSuccess
                          }
                          className={
                            "px-3 py-1 rounded-md dark:bg-red-400 dark:text-black bg-red-400"
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </Form>
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

export default EditReview;
