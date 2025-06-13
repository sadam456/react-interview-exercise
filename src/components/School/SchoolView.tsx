import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
  useToast,
  Icon,
  Container,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBack, IoSchoolOutline } from "react-icons/io5";
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
  searchSchools,
} from "@utils/nces";
import {
  cardFlipVariants,
  containerVariants,
  itemVariants,
} from "../design/AnimationVariants";
import { SchoolSearchGrid } from "./SchoolSearchGrid";
import { SchoolDetailPanel } from "./SchoolDetailPanel";
import { DistrictSidebar } from "./DistrictSidebar";

export const SchoolView: React.FC = () => {
  // --- STATE AND HOOKS MANAGEMENT ---
  const location = useLocation();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<
    NCESSchoolFeatureAttributes[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] =
    useState<NCESSchoolFeatureAttributes | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const toast = useToast();

  const district = location.state?.district as NCESDistrictFeatureAttributes;
  const onBack = () => navigate(-1);

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

  if (!district) {
    return (
      <Container maxW="container.md" py={20}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={8} textAlign="center">
            <Icon as={IoSchoolOutline as any} boxSize={20} color="red.400" />
            <Heading size="xl" color="red.500">
              Oops! No District Data
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="md">
              No district information was found. Please return to the homepage
              and select a district to continue.
            </Text>
            <Button
              onClick={onBack}
              size="lg"
              colorScheme="blue"
              leftIcon={<Icon as={IoArrowBack as any} />}
              borderRadius="full"
              px={8}
            >
              Go Back
            </Button>
          </VStack>
        </motion.div>
      </Container>
    );
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(br-to, blue.20, purple.50, pink.50)"
      py={6}
    >
      <Container maxW="container.xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "repeat(20, 1fr)" }}
            gap={8}
            width="100%"
            alignItems="stretch"
          >
            <GridItem colSpan={{ base: 1, lg: 9 }}>
              <DistrictSidebar
                district={district}
                schools={schools}
                isLoading={isLoading}
                onBack={() => navigate(-1)}
                onMarkerClick={setSelectedSchool}
              />
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 11 }} height="100%" minH="500px">
              <motion.div
                variants={itemVariants}
                style={{ perspective: "1200px", height: "100%" }}
              >
                <motion.div
                  style={{
                    position: "relative",
                    transformStyle: "preserve-3d",
                    height: "100%",
                  }}
                  variants={cardFlipVariants}
                  animate={selectedSchool ? "back" : "front"}
                >
                  <SchoolSearchGrid
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    cityFilter={cityFilter}
                    setCityFilter={setCityFilter}
                    searchFocused={searchFocused}
                    setSearchFocused={setSearchFocused}
                    isLoading={isLoading}
                    filteredSchools={filteredSchools}
                    onSchoolSelect={setSelectedSchool}
                  />

                  {selectedSchool && (
                    <SchoolDetailPanel
                      school={selectedSchool}
                      onClose={() => setSelectedSchool(null)}
                    />
                  )}
                </motion.div>
              </motion.div>
            </GridItem>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};
