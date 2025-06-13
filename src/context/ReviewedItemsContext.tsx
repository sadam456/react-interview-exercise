import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ReviewedItemsContextType {
  reviewedDistrictIds: string[];
  toggleDistrictReviewed: (districtId: string) => void;
  isDistrictReviewed: (districtId: string) => boolean;
  reviewedSchoolIds: string[];
  toggleSchoolReviewed: (schoolId: string) => void;
  isSchoolReviewed: (schoolId: string) => boolean;
}

const ReviewedItemsContext = createContext<
  ReviewedItemsContextType | undefined
>(undefined);

export const ReviewedItemsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reviewedDistrictIds, setReviewedDistrictIds] = useLocalStorage<
    string[]
  >("reviewed_districts", []);
  const [reviewedSchoolIds, setReviewedSchoolIds] = useLocalStorage<string[]>(
    "reviewed_schools",
    []
  );

  const toggleDistrictReviewed = (districtId: string) => {
    setReviewedDistrictIds((prevIds) => {
      if (prevIds.includes(districtId)) {
        return prevIds.filter((id) => id !== districtId); // Uncheck it
      } else {
        return [...prevIds, districtId]; // Check it
      }
    });
  };

  const toggleSchoolReviewed = (schoolId: string) => {
    setReviewedSchoolIds((prevIds) => {
      if (prevIds.includes(schoolId)) {
        return prevIds.filter((id) => id !== schoolId); // Uncheck it
      } else {
        return [...prevIds, schoolId]; // Check it
      }
    });
  };

  const isDistrictReviewed = (districtId: string) =>
    reviewedDistrictIds.includes(districtId);
  const isSchoolReviewed = (schoolId: string) =>
    reviewedSchoolIds.includes(schoolId);

  const value = {
    reviewedDistrictIds,
    toggleDistrictReviewed,
    isDistrictReviewed,
    reviewedSchoolIds,
    toggleSchoolReviewed,
    isSchoolReviewed,
  };

  return (
    <ReviewedItemsContext.Provider value={value}>
      {children}
    </ReviewedItemsContext.Provider>
  );
};

export const useReviewedItems = () => {
  const context = useContext(ReviewedItemsContext);
  if (context === undefined) {
    throw new Error(
      "useReviewedItems must be used within a ReviewedItemsProvider"
    );
  }
  return context;
};
