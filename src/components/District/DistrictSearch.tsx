import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  VStack,
  Spinner,
  useToast,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import {
  searchSchoolDistricts,
  NCESDistrictFeatureAttributes,
} from "@utils/nces";
import { DistrictCard } from "./DistrictCard";

interface DistrictSearchProps {
  onDistrictSelect: (district: NCESDistrictFeatureAttributes) => void;
}

export const DistrictSearch: React.FC<DistrictSearchProps> = ({
  onDistrictSelect,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NCESDistrictFeatureAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    const timerId = setTimeout(() => {
      setIsLoading(true);
      searchSchoolDistricts(query)
        .then((data) => setResults(data))
        .catch((err) => {
          toast({
            title: "Error",
            description: "Could not fetch district data.",
          });
        })
        .finally(() => setIsLoading(false));
    }, 500);
    return () => clearTimeout(timerId);
  }, [query, toast]);

  return (
    <VStack spacing={6} align="stretch" maxWidth="1000px" margin="0 auto">
      <Box textAlign="center">
        <Heading as="h1" size="xl">
          School District Finder
        </Heading>
      </Box>
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <Icon as={IoSearch as any} />
        </InputLeftElement>
        <Input
          placeholder="Search by District Name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="filled"
        />
      </InputGroup>
      {isLoading && <Spinner size="xl" alignSelf="center" />}
      {results.length > 0 && !isLoading && (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {results.map((district) => (
            <DistrictCard
              key={district.OBJECTID}
              district={district}
              onClick={() => onDistrictSelect(district)}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};
