import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IoSearch } from "react-icons/io5";
import {
  searchSchoolDistricts,
  NCESDistrictFeatureAttributes,
} from "@utils/nces";
import { DistrictCard } from "./DistrictCard";
import { usStates } from "src/data/states";

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

  useEffect(() => {
    if (!nameQuery && !cityQuery && !selectedState) {
      setResults([]);
      return;
    }
    const timerId = setTimeout(() => {
      setIsLoading(true);
      searchSchoolDistricts(nameQuery, selectedState || undefined, cityQuery)
        .then((data) => setResults(data))
        .catch((err) => {
          toast({
            title: "Error",
            description: "Could not fetch district data.",
          });
        })
        .finally(() => setIsLoading(false));
    }, 800);
    return () => clearTimeout(timerId);
  }, [nameQuery, cityQuery, selectedState, toast]);

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

      <VStack spacing={4} bg="white" p={6} borderRadius="lg" boxShadow="sm">
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <Icon as={IoSearch as any} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by District Name..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            variant="filled"
          />
        </InputGroup>
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
