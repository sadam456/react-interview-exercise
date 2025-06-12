import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Spinner,
  Input,
  SimpleGrid,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
  searchSchools,
} from "@utils/nces";
import { SchoolCard } from "./SchoolCard";

export const SchoolView: React.FC = () => {
  const [schools, setSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<
    NCESSchoolFeatureAttributes[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const district = location.state?.district as NCESDistrictFeatureAttributes;
  const onBack = () => navigate("/");

  useEffect(() => {
    setIsLoading(true);
    searchSchools("", district.LEAID)
      .then((data) => {
        setSchools(data);
        setFilteredSchools(data);
      })
      .catch((err) =>
        toast({ title: "Error", description: "Could not fetch schools." })
      )
      .finally(() => setIsLoading(false));
  }, [district.LEAID, toast]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredSchools(schools);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = schools.filter((school) =>
        school.NAME?.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredSchools(filtered);
    }
  }, [searchQuery, schools]);
  if (!district) {
    return (
      <VStack spacing={4} pt={20}>
        <Heading>Error</Heading>
        <Text>No district data found. Please go back to the homepage.</Text>
        <Button onClick={onBack}>Go to Homepage</Button>
      </VStack>
    );
  }
  return (
    <VStack spacing={6} align="stretch">
      <Button onClick={onBack}>Back to Districts</Button>
      <Box bg="gray.50" p={5} borderRadius="lg">
        <Heading as="h2" size="lg">
          {district.NAME}
        </Heading>
        <Text>
          {district.LCITY}, {district.LSTATE}
        </Text>
      </Box>
      <Input
        placeholder="Search for a school by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isLoading}
      />
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredSchools.map((school) => (
            <SchoolCard key={school.NCESSCH} school={school} />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};
