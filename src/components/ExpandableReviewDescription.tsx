import React, { useState } from "react";
import { trimString } from "../utilities/trimString";
import { Button } from "react-aria-components";

type ExpandableReviewDescriptionProps = {
  reviewDescription: string;
  trimCap?: number;
  showMoreText?: string;
  showLessText?: string;
};
function ExpandableReviewDescription({
  reviewDescription,
  trimCap = 425,
  showMoreText = "Show more",
  showLessText = "Show less",
}: ExpandableReviewDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isExpanded ? (
        <span>{reviewDescription}</span>
      ) : (
        <span>{trimString(reviewDescription, trimCap)}</span>
      )}
      <br></br>
      {reviewDescription.length > trimCap && (
        <Button
          className={({ isHovered }) =>
            `text-[#565959] dark:text-[#a5a8a8] ${isHovered && "underline underline-offset-2"}`
          }
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? showLessText : showMoreText}
        </Button>
      )}
    </>
  );
}

export default ExpandableReviewDescription;
