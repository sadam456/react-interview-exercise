import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
} from "@utils/nces";

// Define the shape of our context data
interface FavoritesContextType {
  // District functions
  savedDistricts: NCESDistrictFeatureAttributes[];
  addDistrict: (district: NCESDistrictFeatureAttributes) => void;
  removeDistrict: (districtId: string) => void;
  isDistrictSaved: (districtId: string) => boolean;
  // School functions (NEW)
  savedSchools: NCESSchoolFeatureAttributes[];
  addSchool: (school: NCESSchoolFeatureAttributes) => void;
  removeSchool: (schoolId: string) => void;
  isSchoolSaved: (schoolId: string) => boolean;
}

// Create the context with a default value
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

// Create the Provider component
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  // State for Districts
  const [savedDistricts, setSavedDistricts] = useLocalStorage<
    NCESDistrictFeatureAttributes[]
  >("saved_districts", []);

  // State for Schools (NEW)
  const [savedSchools, setSavedSchools] = useLocalStorage<
    NCESSchoolFeatureAttributes[]
  >("saved_schools", []);

  // --- District Functions ---
  const addDistrict = (district: NCESDistrictFeatureAttributes) => {
    setSavedDistricts((prev) => [...prev, district]);
  };
  const removeDistrict = (districtId: string) => {
    setSavedDistricts((prev) => prev.filter((d) => d.LEAID !== districtId));
  };
  const isDistrictSaved = (districtId: string) => {
    return savedDistricts.some((d) => d.LEAID === districtId);
  };

  // --- School Functions (NEW) ---
  const addSchool = (school: NCESSchoolFeatureAttributes) => {
    setSavedSchools((prev) => [...prev, school]);
  };
  const removeSchool = (schoolId: string) => {
    // Schools have a unique NCESSCH property
    setSavedSchools((prev) => prev.filter((s) => s.NCESSCH !== schoolId));
  };
  const isSchoolSaved = (schoolId: string) => {
    return savedSchools.some((s) => s.NCESSCH === schoolId);
  };

  const value = {
    savedDistricts,
    addDistrict,
    removeDistrict,
    isDistrictSaved,
    savedSchools, // <-- Add new values to the context
    addSchool,
    removeSchool,
    isSchoolSaved,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the context (no changes here)
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
