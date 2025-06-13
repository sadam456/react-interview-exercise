import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Container,
  Flex,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { useFavorites } from "src/context/FavoritesContext";
import { Link } from "react-router-dom";
import { IoHeart, IoArrowBack } from "react-icons/io5";

// Import our new, focused components
import { EmptyFavoritesState } from "./EmptyFavoritesState";
import { SavedDistrictsSection } from "./SavedDistrictsSection";
import { OrphanSchoolsSection } from "./OrphanSchoolsSection";

export const FavoritesPage: React.FC = () => {
  const { savedDistricts, savedSchools, removeSchool } = useFavorites();
  const savedDistrictIds = savedDistricts.map((d) => d.LEAID);
  const orphanSchools = savedSchools.filter(
    (s) => !savedDistrictIds.includes(s.LEAID as string)
  );
  const hasFavorites = savedDistricts.length > 0 || savedSchools.length > 0;

  return (
    <Box minHeight="100vh" bg="gray.20">
      <Container maxWidth="1200px" py={12} px={6}>
        <VStack spacing={12} align="stretch">
          {/* Page Header Area */}
          <Box textAlign="center" py={8}>
            <Flex align="center" justify="center" mb={4}>
              <Icon as={IoHeart as any} boxSize={10} color="green.500" mr={2} />
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl" }}
                bgGradient="linear(to-r, #2D7D32, #4CAF50, #66BB6A)"
                bgClip="text"
              >
                My Favorites
              </Heading>
            </Flex>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="600px"
              mx="auto"
            >
              Your personalized collection of educational communities and
              institutions
            </Text>
            {hasFavorites && (
              <Button
                as={Link}
                to="/"
                leftIcon={<Icon as={IoArrowBack as any} />}
                size="lg"
                mt={6}
                colorScheme="green"
                variant="outline"
                borderRadius="full"
              >
                Back to Search
              </Button>
            )}
          </Box>

          {/* Conditional rendering is now much cleaner */}
          {!hasFavorites ? (
            <EmptyFavoritesState />
          ) : (
            <>
              {savedDistricts.length > 0 && (
                <SavedDistrictsSection districts={savedDistricts} />
              )}
              {orphanSchools.length > 0 && (
                <OrphanSchoolsSection
                  schools={orphanSchools}
                  removeSchool={removeSchool}
                />
              )}
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};
