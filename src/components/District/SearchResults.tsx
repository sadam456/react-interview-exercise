import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import { DistrictCard } from "./DistrictCard";
import { NCESDistrictFeatureAttributes } from "@utils/nces";

interface SearchResultsProps {
  isLoading: boolean;
  results: NCESDistrictFeatureAttributes[];
  hasAttemptedSearch: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  isLoading,
  results,
  hasAttemptedSearch,
}) => {
  if (isLoading) {
    return (
      <Box textAlign="center" paddingY={16}>
        <Spinner size="xl" color="green.500" thickness="4px" speed="0.8s" />
        <Text mt={4} color="gray.600" fontSize="lg">
          Searching for districts...
        </Text>
      </Box>
    );
  }

  if (results.length === 0 && hasAttemptedSearch) {
    return (
      <VStack
        spacing={4}
        bg="white"
        p={12}
        borderRadius="2xl"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        border="1px solid"
        borderColor="gray.100"
      >
        <Box
          w={16}
          h={16}
          bg="gray.100"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={IoSearch as any} color="gray.400" boxSize={8} />
        </Box>
        <Heading as="h3" size="lg" color="gray.700" textAlign="center">
          No Districts Found
        </Heading>
        <Text color="gray.500" textAlign="center" maxWidth="400px">
          Try adjusting your search terms or filters to discover more options.
        </Text>
      </VStack>
    );
  }

  if (results.length > 0) {
    return (
      <Box>
        <Text fontSize="lg" fontWeight="600" color="gray.700" mb={6} px={2}>
          Found {results.length} district{results.length !== 1 ? "s" : ""}
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={2}>
          {results.map((district) => (
            <DistrictCard key={district.OBJECTID} district={district} />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  return null;
};
