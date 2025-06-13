import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  Input,
  VStack,
  Spinner,
  useToast,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Icon,
  HStack,
  List,
  ListItem,
  Heading,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useSearchParams } from "react-router-dom";
import { IoSearch, IoTimeOutline } from "react-icons/io5";
import {
  searchSchoolDistricts,
  NCESDistrictFeatureAttributes,
} from "@utils/nces";
import { DistrictCard } from "./DistrictCard";
import { usStates } from "src/data/states";
import { useLocalStorage } from "src/hooks/useLocalStorage";

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
    <VStack spacing={6} align="stretch" maxWidth="1000px" margin="0 auto">
      {/* Page Header */}
      <Box textAlign="center">
        <Text as="h1" fontSize="4xl" fontWeight="bold" lineHeight="tight">
          School District Finder
        </Text>
        <Text fontSize="lg" color="gray.600">
          Search by name and/or filter by location.
        </Text>
      </Box>

      {/* Search and Filter Controls */}
      <VStack
        position="relative"
        spacing={4}
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Box position="relative" width="100%">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={IoSearch as any} color="gray.400" />
            </InputLeftElement>
            <Input
              ref={inputRef}
              onKeyDown={handleKeyDown}
              placeholder="Search by District Name..."
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              variant="filled"
              onFocus={() => setIsHistoryVisible(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsHistoryVisible(false);
                }, 150);
              }}
            />
          </InputGroup>
          {/* Search History Dropdown */}
          {isHistoryVisible && searchHistory.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              mt={2}
              bg="white"
              width="100%"
              boxShadow="lg"
              borderRadius="md"
              zIndex="dropdown"
              p={2}
            >
              <List spacing={1}>
                {searchHistory.map((item, index) => (
                  <ListItem
                    key={index}
                    onClick={() => {
                      setNameQuery(item);
                      setIsHistoryVisible(false);
                    }}
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={IoTimeOutline as any} mr={2} color="gray.500" />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
        {/* City and State Filters */}
        <HStack width="100%">
          <Input
            placeholder="Filter by City..."
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
          />
          <Select
            name="state-select"
            options={stateOptions}
            placeholder="Filter by State"
            isClearable
            value={
              stateOptions.find((option) => option.value === selectedState) ||
              null
            }
            onChange={(selectedOption) => {
              setSelectedState(selectedOption ? selectedOption.value : null);
            }}
            chakraStyles={{
              container: (provided) => ({ ...provided, width: "100%" }),
            }}
          />
        </HStack>
      </VStack>

      {/*"No Results" message*/}
      {!isLoading &&
        results.length === 0 &&
        (nameQuery || cityQuery || selectedState) && (
          <VStack spacing={3} bg="gray.50" p={10} borderRadius="lg">
            <Heading as="h3" size="md">
              No Districts Found
            </Heading>
            <Text color="gray.600">
              Please try adjusting your search terms or filters.
            </Text>
          </VStack>
        )}

      {/* Loading and Results Display */}
      {isLoading && (
        <Box textAlign="center" paddingY={10}>
          <Spinner size="xl" />
        </Box>
      )}

      {results.length > 0 && !isLoading && (
        <Box overflowY="auto" maxHeight="60vh" p={1}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
            {results.map((district) => (
              <DistrictCard key={district.OBJECTID} district={district} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};
