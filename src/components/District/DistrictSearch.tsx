import React, { useState, useEffect, useRef } from "react";
import { Box, VStack, useToast } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import {
  searchSchoolDistricts,
  NCESDistrictFeatureAttributes,
} from "@utils/nces";
import { usStates } from "src/data/states";
import { useLocalStorage } from "src/hooks/useLocalStorage";
import { SearchPageHeader } from "./SearchPageHeader";
import { SearchControls } from "./SearchControls";
import { SearchResults } from "./SearchResults";

// Formats the states data for the react-select component
const stateOptions = usStates.map((state) => ({
  label: state.name,
  value: state.abbreviation,
}));

export const DistrictSearch: React.FC = () => {
  // --- STATE MANAGEMENT ---

  // Hook to read from and write to the URL's query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Component state for the filter inputs, initialized from the URL on first load
  const [nameQuery, setNameQuery] = useState(searchParams.get("name") || "");
  const [cityQuery, setCityQuery] = useState(searchParams.get("city") || "");
  const [selectedState, setSelectedState] = useState<string | null>(
    searchParams.get("state") || null
  );

  // State for API results and loading status
  const [results, setResults] = useState<NCESDistrictFeatureAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // State for the search history feature
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
    "district_search_history",
    []
  );
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  // Ref for direct access to the search input element
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Adds a search term to the history, ensuring no duplicates and capping the list size.
   */
  const addTermToHistory = (term: string) => {
    if (!term) return;
    // By using a function inside setSearchHistory, we guarantee we have the latest state.
    setSearchHistory((prevHistory) => {
      const newHistory = prevHistory.filter(
        (item) => item.toLowerCase() !== term.toLowerCase()
      );
      newHistory.unshift(term);
      return newHistory.slice(0, 5);
    });
  };

  /**
   * Handler for the main search input to close the history dropdown on "Enter" press.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      inputRef.current?.blur();
    }
  };
  /**
   * This effect syncs the component's filter state (name, city, state) to the URL
   * search parameters. It's debounced to avoid updating the URL on every keystroke.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (nameQuery) params.set("name", nameQuery);
      else params.delete("name");
      if (cityQuery) params.set("city", cityQuery);
      else params.delete("city");
      if (selectedState) params.set("state", selectedState);
      else params.delete("state");

      setSearchParams(params);
    }, 500);

    return () => clearTimeout(handler);
  }, [nameQuery, cityQuery, selectedState, setSearchParams]);

  /**
   * This effect fetches data from the API whenever the URL search parameters change.
   */
  useEffect(() => {
    const currentName = searchParams.get("name") || "";
    const currentState = searchParams.get("state") || "";
    const currentCity = searchParams.get("city") || "";

    if (!currentName && !currentState && !currentCity) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    searchSchoolDistricts(currentName, currentState || undefined, currentCity)
      .then((data) => {
        setResults(data);
        if (currentName) addTermToHistory(currentName);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Could not fetch district data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [searchParams, toast]); // Dependency on searchParams ensures this runs when the URL changes.

  return (
    <Box minHeight="100vh" bg="gray.20">
      <VStack
        spacing={8}
        align="stretch"
        maxWidth="1200px"
        margin="0 auto"
        py={8}
        px={6}
      >
        <SearchPageHeader />
        <SearchControls
          nameQuery={nameQuery}
          setNameQuery={setNameQuery}
          cityQuery={cityQuery}
          setCityQuery={setCityQuery}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          searchHistory={searchHistory}
          isHistoryVisible={isHistoryVisible}
          setIsHistoryVisible={setIsHistoryVisible}
          inputRef={inputRef}
          handleKeyDown={handleKeyDown}
          stateOptions={stateOptions}
        />
        <SearchResults
          isLoading={isLoading}
          results={results}
          hasAttemptedSearch={!!(nameQuery || cityQuery || selectedState)}
        />
      </VStack>
    </Box>
  );
};
