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
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBack, IoSearch, IoReturnUpBack } from "react-icons/io5";
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
  searchSchools,
} from "@utils/nces";
import { SchoolCard } from "./SchoolCard";
import { MapComponent } from "@components/Map/MapComponent";

// Helper function to format API keys from the response into readable labels.
const formatKey = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const SchoolView: React.FC = () => {
  // --- STATE AND HOOKS MANAGEMENT ---

  // Hooks for routing and navigation
  const location = useLocation();
  const navigate = useNavigate();

  // State for the fetched list of all schools in the district
  const [schools, setSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  // State for the client-side filtered list of schools to display
  const [filteredSchools, setFilteredSchools] = useState<
    NCESSchoolFeatureAttributes[]
  >([]);
  // State for the school name and city filter inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  // State for loading and API status
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // State to manage the currently selected school for the detail view (which triggers the card flip)
  const [selectedSchool, setSelectedSchool] =
    useState<NCESSchoolFeatureAttributes | null>(null);

  // Get the district data passed from the previous page via the Link state.
  const district = location.state?.district as NCESDistrictFeatureAttributes;
  const onBack = () => navigate(-1);

  /**
   * Effect to fetch all schools for the selected district when the component mounts
   * or when the district itself changes.
   */
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

  /**
   * Effect to perform fast, client-side filtering whenever the user types
   * in the school name or city search inputs.
   */
  useEffect(() => {
    const lowercasedNameQuery = searchQuery.toLowerCase();
    const lowercasedCityQuery = cityFilter.toLowerCase();

    const filtered = schools.filter((school) => {
      const nameMatch =
        !lowercasedNameQuery ||
        school.NAME?.toLowerCase().includes(lowercasedNameQuery);
      const cityMatch =
        !lowercasedCityQuery ||
        school.CITY?.toLowerCase().includes(lowercasedCityQuery);
      return nameMatch && cityMatch;
    });
    setFilteredSchools(filtered);
  }, [searchQuery, cityFilter, schools]);

  // Animation variants for the framer-motion component.
  const cardVariants = { front: { rotateY: 0 }, back: { rotateY: 180 } };

  // Guard clause to handle cases where a user navigates directly to this URL without district data.
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
    // Main two-column layout for the page.
    <Grid
      templateColumns={{ base: "1fr", lg: "repeat(20, 1fr)" }}
      gap={6}
      width="100%"
      alignItems="stretch"
    >
      {/* --- Left Column: Displays static district info and the interactive map. --- */}
      <GridItem colSpan={{ base: 1, lg: 9 }}>
        <VStack
          spacing={4}
          align="stretch"
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Button
            onClick={onBack}
            leftIcon={<Icon as={IoArrowBack as any} />}
            alignSelf="flex-start"
          >
            All Districts
          </Button>
          {/* Sticky box that shows the details of the currently selected district. */}
          <Box
            bg="blue.50"
            p={5}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="blue.200"
            position="sticky"
            top="100px"
            width="80%"
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
          {/* Renders the Leaflet map with markers for all schools in the district. */}
          {!isLoading && schools.length > 0 && (
            <Box mt={4} flex="1">
              <MapComponent
                schools={schools}
                onMarkerClick={setSelectedSchool}
              />
            </Box>
          )}
        </VStack>
      </GridItem>

      {/* --- Right Column: Contains the main interactive flippable card. --- */}
      <GridItem colSpan={{ base: 1, lg: 11 }}>
        <Box sx={{ perspective: "1200px" }} height="100%">
          {/* This motion.div handles the card flip animation based on whether a school is selected. */}
          <motion.div
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
              height: "100%",
            }}
            variants={cardVariants}
            animate={selectedSchool ? "back" : "front"}
            transition={{ duration: 0.7 }}
          >
            {/* --- Front of Card: School Search and Results Grid --- */}
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
                <Input
                  size="lg"
                  placeholder="Filter by City..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  variant="filled"
                  disabled={isLoading}
                />
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
                  {/*Conditional logic for empty results === */}
                  {filteredSchools.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {filteredSchools.map((school) => (
                        <SchoolCard
                          key={school.NCESSCH}
                          school={school}
                          onClick={() => setSelectedSchool(school)}
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <VStack spacing={3} p={10} flex={1} justifyContent="center">
                      <Heading as="h3" size="md">
                        No Schools Found
                      </Heading>
                      <Text color="gray.600">
                        No schools match your current filter criteria.
                      </Text>
                    </VStack>
                  )}
                </Box>
              )}
            </VStack>

            {/* --- Back of Card: Detailed information for the selected school --- */}
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
