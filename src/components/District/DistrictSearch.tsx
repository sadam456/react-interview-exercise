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
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IoSearch, IoTimeOutline } from "react-icons/io5";
import {
  searchSchoolDistricts,
  NCESDistrictFeatureAttributes,
} from "@utils/nces";
import { DistrictCard } from "./DistrictCard";
import { usStates } from "src/data/states";
import { useLocalStorage } from "src/hooks/useLocalStorage";

const stateOptions = usStates.map((state) => ({
  label: state.name,
  value: state.abbreviation,
}));

export const DistrictSearch: React.FC = () => {
  const [nameQuery, setNameQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [results, setResults] = useState<NCESDistrictFeatureAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
    "district_search_history",
    []
  );
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTermToHistory = (term: string) => {
    if (!term) return;
    const newHistory = searchHistory.filter(
      (item) => item.toLowerCase() !== term.toLowerCase()
    );
    newHistory.unshift(term);
    setSearchHistory(newHistory.slice(0, 5));
  };

  useEffect(() => {
    if (!nameQuery && !cityQuery && !selectedState) {
      setResults([]);
      return;
    }
    const timerId = setTimeout(() => {
      setIsLoading(true);
      searchSchoolDistricts(nameQuery, selectedState || undefined, cityQuery)
        .then((data) => {
          setResults(data);
          addTermToHistory(nameQuery);
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
    }, 800);
    return () => clearTimeout(timerId);
  }, [nameQuery, cityQuery, selectedState, toast]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  return (
    <VStack spacing={6} align="stretch" maxWidth="1000px" margin="0 auto">
      <Box textAlign="center">
        <Text as="h1" fontSize="4xl" fontWeight="bold" lineHeight="tight">
          School District Finder
        </Text>
        <Text fontSize="lg" color="gray.600">
          Search by name and/or filter by location.
        </Text>
      </Box>

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
