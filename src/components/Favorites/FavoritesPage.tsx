import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid, // <-- This is the key component we'll use
  Button,
  Divider,
  List,
  ListItem,
  ListIcon,
  IconButton,
  Flex,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { useFavorites } from "src/context/FavoritesContext";
import { DistrictCard } from "@components/District/DistrictCard";
import { Link } from "react-router-dom";
import { IoSchool, IoTrash, IoArrowBack } from "react-icons/io5";

export const FavoritesPage: React.FC = () => {
  const { savedDistricts, savedSchools, removeSchool } = useFavorites();

  const savedDistrictIds = savedDistricts.map((d) => d.LEAID);
  const orphanSchools = savedSchools.filter(
    (s) => !savedDistrictIds.includes(s.LEAID as string)
  );

  const hasFavorites = savedDistricts.length > 0 || savedSchools.length > 0;

  return (
    <VStack spacing={10} align="stretch">
      <Flex align="center">
        <Heading as="h1">My Favorites</Heading>
        <Spacer />
        {hasFavorites && (
          <Button as={Link} to="/" leftIcon={<Icon as={IoArrowBack as any} />}>
            Back to Search
          </Button>
        )}
      </Flex>

      {!hasFavorites && (
        <VStack spacing={4} bg="white" p={10} borderRadius="lg" boxShadow="md">
          <Text fontSize="lg">You haven't saved anything yet.</Text>
          <Text color="gray.600">
            Click the star icon on a district or school to add it to your
            favorites.
          </Text>
          <Button as={Link} to="/" colorScheme="blue" mt={4}>
            Find Districts
          </Button>
        </VStack>
      )}

      {savedDistricts.length > 0 && (
        <VStack spacing={8} align="stretch">
          <Heading as="h2" size="lg" borderBottomWidth="2px" pb={2}>
            Saved Districts
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
            {/* We just render the DistrictCard. It does the rest! */}
            {savedDistricts.map((district) => (
              <DistrictCard key={district.OBJECTID} district={district} />
            ))}
          </SimpleGrid>
        </VStack>
      )}

      {/* The "Other Saved Schools" section remains at the bottom, as requested */}
      {orphanSchools.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="lg" borderBottomWidth="2px" pb={2}>
            Other Saved Schools
          </Heading>
          <List spacing={3} bg="white" p={5} borderRadius="lg" boxShadow="sm">
            {orphanSchools.map((school) => (
              <ListItem key={school.NCESSCH} display="flex" alignItems="center">
                <ListIcon as={IoSchool as any} color="blue.500" />
                <Box>
                  <Text fontWeight="bold">{school.NAME}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {school.CITY}, {school.STATE}
                  </Text>
                </Box>
                <Spacer />
                <IconButton
                  aria-label="Remove school"
                  icon={<Icon as={IoTrash as any} />}
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeSchool(school.NCESSCH as string)}
                />
              </ListItem>
            ))}
          </List>
        </VStack>
      )}
    </VStack>
  );
};
