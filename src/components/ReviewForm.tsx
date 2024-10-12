import { IconStarFilled } from "@tabler/icons-react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
  ToggleButton,
} from "react-aria-components";

export const ratingValues = [1, 2, 3, 4, 5] as const;
export type RatingValues = (typeof ratingValues)[number];

export type ReviewFormProps = {
  formIsInvalid: boolean;
  rating: RatingValues | undefined;
  setRating: React.Dispatch<
    React.SetStateAction<1 | 2 | 3 | 4 | 5 | undefined>
  >;
  reviewerName: string;
  setReviewerName: React.Dispatch<React.SetStateAction<string>>;
  reviewTitle: string;
  setReviewTitle: React.Dispatch<React.SetStateAction<string>>;
  reviewDesc: string;
  setReviewDesc: React.Dispatch<React.SetStateAction<string>>;
  formTitle: string;
  className?: string;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  validationError:
    | {
        [index: string]: string;
      }
    | undefined;
  setValidationError: React.Dispatch<
    React.SetStateAction<
      | {
          [index: string]: string;
        }
      | undefined
    >
  >;
};

type ReviewRatingBtnsProps = {
  className?: string;
  value: number;
  rating: number | undefined;
  setRating: React.Dispatch<
    React.SetStateAction<1 | 2 | 3 | 4 | 5 | undefined>
  >;
  validationError:
    | {
        [index: string]: string;
      }
    | undefined;
  setValidationError: React.Dispatch<
    React.SetStateAction<
      | {
          [index: string]: string;
        }
      | undefined
    >
  >;
};
export function ReviewRatingBtns({
  rating,
  value,
  setRating,
  setValidationError,
  validationError,
}: ReviewRatingBtnsProps) {
  return (
    <ToggleButton
      type="button"
      isSelected={rating === value}
      onChange={() => {
        if (validationError?.ratings) {
          setValidationError(undefined);
        }
        if (ratingValues.includes(value as RatingValues)) {
          setRating(value as RatingValues);
        }
      }}
      className={"relative flex justify-center items-center group"}
    >
      {({ isHovered, isSelected, isFocusVisible }) => (
        <>
          <span className="absolute text-black font-bold bg-transparent">
            {value}
          </span>
          <IconStarFilled
            size={42}
            className={`${isSelected || value < Number(rating) ? "fill-yellow-300" : isFocusVisible || isHovered ? "fill-yellow-100" : "fill-neutral-400"}`}
          />
        </>
      )}
    </ToggleButton>
  );
}
// const route = getRouteApi("/shop/product/$productId/create-review");

function ReviewForm(props: ReviewFormProps) {
  return (
    <>
      <Form
        onSubmit={props.handleFormSubmit}
        validationErrors={props.validationError}
        className="flex flex-col gap-2 max-w-[500px] mx-auto"
      >
        {props.formTitle && (
          <h1 className="font-bold text-2xl mb-2">{props.formTitle}</h1>
        )}
        <TextField
          name="reviewer_name"
          isRequired
          className={"flex flex-col gap-1"}
        >
          <Label>Reviewer Name</Label>
          <Input
            value={props.reviewerName || "No name provided"}
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
                        validationError={props.validationError}
                        setValidationError={props.setValidationError}
                        setRating={props.setRating}
                        rating={props.rating}
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
                    validationError={props.validationError}
                    setValidationError={props.setValidationError}
                    value={value}
                    setRating={props.setRating}
                    rating={props.rating}
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
            value={props.reviewTitle}
            minLength={2}
            className={`dark:text-slate-100 p-2 rounded-lg dark:bg-slate-800`}
            onChange={(e) => props.setReviewTitle(e.target.value)}
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
            value={props.reviewDesc}
            onChange={(e) => props.setReviewDesc(e.target.value)}
            rows={5}
            className={`dark:text-slate-100 py-1 px-2 rounded-lg dark:bg-slate-800`}
          ></TextArea>
          <FieldError className={`text-red-500 mt-2`} />
        </TextField>
        <Button
          type="submit"
          isDisabled={props.formIsInvalid}
          className={({ isHovered, isFocusVisible, isDisabled }) =>
            `text-black px-3 py-2 rounded-sm text-lg mt-2 ${isHovered || isFocusVisible ? "bg-[#ff841f]" : isDisabled ? "bg-gray-400" : "bg-orange-400"}`
          }
        >
          Submit review
        </Button>
      </Form>
    </>
  );
}

export default ReviewForm;
