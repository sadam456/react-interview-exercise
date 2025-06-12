import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Spinner,
  Input,
  Grid,
  GridItem,
  List,
  ListItem,
  useToast,
  Icon,
  InputGroup,
  InputLeftElement,
  Divider,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  IoArrowBack,
  IoSearch,
  IoReturnUpBack,
  IoFilter,
} from "react-icons/io5";
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
  searchSchools,
} from "@utils/nces";
import { SchoolCard } from "./SchoolCard"; // <-- Import our new SchoolCard

const formatKey = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const SchoolView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<
    NCESSchoolFeatureAttributes[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] =
    useState<NCESSchoolFeatureAttributes | null>(null);
  // 1. New state for the city filter
  const [cityFilter, setCityFilter] = useState("");
  const toast = useToast();
  const district = location.state?.district as NCESDistrictFeatureAttributes;
  const onBack = () => navigate("/");
  // Effect to fetch schools (no change)
  useEffect(() => {
    if (!district) return;
    setIsLoading(true);
    searchSchools("", district.LEAID)
      .then((data) => {
        setSchools(data);
        setFilteredSchools(data);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Could not fetch school data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [district, toast]);

  // 2. This useEffect now filters by BOTH name and city on the client-side for a fast UX.
  useEffect(() => {
    const lowercasedNameQuery = searchQuery.toLowerCase();
    const lowercasedCityQuery = cityFilter.toLowerCase();

    const filtered = schools.filter((school) => {
      // Check for name match (if name query exists)
      const nameMatch =
        !lowercasedNameQuery ||
        school.NAME?.toLowerCase().includes(lowercasedNameQuery);
      // Check for city match (if city query exists)
      const cityMatch =
        !lowercasedCityQuery ||
        school.CITY?.toLowerCase().includes(lowercasedCityQuery);

      return nameMatch && cityMatch;
    });
    setFilteredSchools(filtered);
  }, [searchQuery, cityFilter, schools]); // Re-run if any filter or the base school list changes

  const cardVariants = { front: { rotateY: 0 }, back: { rotateY: 180 } };

  // If a user navigates directly to this URL without coming from a Link,
  // the district data won't exist. We should handle this case.
  if (!district) {
    return (
      <VStack spacing={4} pt={20}>
        <Heading>Error</Heading>
        <Text>
          No district data found. Please go back to the homepage and select a
          district.
        </Text>
        <Button onClick={onBack}>Go to Homepage</Button>
      </VStack>
    );
  }

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
      gap={6}
      width="100%"
    >
      {/* Left Column: District Info */}
      <GridItem colSpan={1}>
        <VStack spacing={4} align="stretch">
          <Button
            onClick={onBack}
            leftIcon={<Icon as={IoArrowBack as any} />}
            alignSelf="flex-start"
          >
            All Districts
          </Button>
          <Box
            bg="blue.50"
            p={5}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="blue.200"
            position="sticky"
            top="100px"
          >
            <Heading as="h2" size="md">
              {district.NAME}
            </Heading>
            <Text fontSize="md" color="gray.700">
              {district.LCITY}, {district.LSTATE}
            </Text>
            <Divider my={3} />
            <Text fontSize="sm" color="gray.600">
              <strong>ID:</strong> {district.LEAID}
              <br />
              <strong>County:</strong> {district.NMCNTY15}
            </Text>
          </Box>
        </VStack>
      </GridItem>

      {/* Right Column: The flippable card */}
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <Box perspective="1200px">
          <motion.div
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
              minHeight: "70vh",
            }}
            variants={cardVariants}
            animate={selectedSchool ? "back" : "front"}
            transition={{ duration: 0.7 }}
          >
            {/* Front of the Card: Search and Grid of SchoolCards */}
            <VStack
              as={motion.div}
              spacing={4}
              align="stretch"
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              bg="white"
              sx={{
                backfaceVisibility: "hidden",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              {/* 3. New UI with both search inputs */}
              <HStack>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" color="gray.400">
                    <Icon as={IoSearch as any} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by School Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="filled"
                    disabled={isLoading}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={IoFilter as any} />
                  </InputLeftElement>
                  <Input
                    placeholder="Filter by City..."
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    variant="filled"
                    disabled={isLoading}
                  />
                </InputGroup>
              </HStack>
              {isLoading ? (
                <Box
                  textAlign="center"
                  p={10}
                  flex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner size="xl" />
                </Box>
              ) : (
                <Box overflowY="auto" flex={1}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {filteredSchools.map((school) => (
                      <SchoolCard
                        key={school.NCESSCH}
                        school={school}
                        onClick={() => setSelectedSchool(school)}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>

            {/* Back of the Card: School Details */}
            <VStack
              as={motion.div}
              spacing={4}
              align="stretch"
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              bg="gray.50"
              overflowY="auto"
              sx={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              {selectedSchool && (
                <>
                  <Button
                    onClick={() => setSelectedSchool(null)}
                    leftIcon={<Icon as={IoReturnUpBack as any} />}
                    alignSelf="flex-start"
                  >
                    Back to List
                  </Button>
                  <Divider />
                  <Heading as="h3" size="lg">
                    {selectedSchool.NAME}
                  </Heading>
                  <List spacing={1} fontSize="sm" pl={2}>
                    {Object.entries(selectedSchool).map(
                      ([key, value]) =>
                        value && (
                          <ListItem key={key}>
                            <strong>{formatKey(key)}:</strong> {value}
                          </ListItem>
                        )
                    )}
                  </List>
                </>
              )}
            </VStack>
          </motion.div>
        </Box>
      </GridItem>
    </Grid>
  );
};
