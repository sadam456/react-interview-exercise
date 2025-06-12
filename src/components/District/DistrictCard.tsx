import React from "react";
import {
  Heading,
  Text,
  VStack,
  Divider,
  Icon,
  Button,
  IconButton,
  Box,
  List,
  ListItem,
  ListIcon,
  Spacer,
} from "@chakra-ui/react";
import { NCESDistrictFeatureAttributes } from "@utils/nces";
import {
  IoBusiness,
  IoBookmark,
  IoBookmarkOutline,
  IoSchool,
  IoTrash,
} from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "src/context/FavoritesContext";

interface DistrictCardProps {
  district: NCESDistrictFeatureAttributes;
}

export const DistrictCard: React.FC<DistrictCardProps> = ({ district }) => {
  const {
    isDistrictSaved,
    addDistrict,
    removeDistrict,
    savedSchools,
    removeSchool,
  } = useFavorites();

  const location = useLocation();
  const isSaved = isDistrictSaved(district.LEAID);

  // Find the schools that belong to THIS district card
  const schoolsInThisDistrict = savedSchools.filter(
    (school) => school.LEAID === district.LEAID
  );

  // Decide whether to show the list based on the current page path
  const shouldShowSchools = location.pathname === "/favorites";

  const handleSaveClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (isSaved) {
      removeDistrict(district.LEAID);
    } else {
      addDistrict(district);
    }
  };

  return (
    <Box
      as={Link}
      to={`/district/${district.LEAID}`}
      state={{ district }}
      _hover={{ textDecoration: "none" }}
    >
      <VStack
        position="relative"
        spacing={3}
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        _hover={{
          boxShadow: "lg",
          transform: "translateY(-2px)",
        }}
        transition="all 0.2s ease-in-out"
        align="stretch"
        height="100%"
        cursor="pointer"
      >
        <IconButton
          aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
          icon={
            <Icon
              as={isSaved ? IoBookmark : (IoBookmarkOutline as any)}
              color="black.400"
            />
          }
          isRound
          size="sm"
          variant="ghost"
          onClick={handleSaveClick}
          position="absolute"
          top="8px"
          right="8px"
        />

        <Icon
          as={IoBusiness as any}
          boxSize={8}
          color="blue.500"
          alignSelf="center"
          pt={4}
        />
        <VStack spacing={1} textAlign="center" flex={1} justify="center">
          <Heading size="sm">{district.NAME}</Heading>
          <Text fontSize="sm" color="gray.600">
            {district.LCITY}, {district.LSTATE}
          </Text>
        </VStack>
        <Divider />
        <Button
          as="span"
          variant="outline"
          size="sm"
          colorScheme="blue"
          pointerEvents="none"
          alignSelf="center"
        >
          Select this district
        </Button>

        {/* Conditionally render the list of saved schools only on the favorites page */}
        {shouldShowSchools && schoolsInThisDistrict.length > 0 && (
          <VStack align="stretch" pt={3} mt={3} borderTopWidth="1px">
            <Heading as="h4" size="xs" textAlign="left">
              Saved Schools:
            </Heading>
            <List spacing={2}>
              {schoolsInThisDistrict.map((school) => (
                <ListItem
                  key={school.NCESSCH}
                  display="flex"
                  alignItems="center"
                  fontSize="sm"
                >
                  <ListIcon as={IoSchool as any} color="gray.500" />
                  <Text noOfLines={1}>{school.NAME}</Text>
                  <Spacer />
                  <IconButton
                    aria-label="Remove school"
                    icon={<Icon as={IoTrash as any} />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      removeSchool(school.NCESSCH as string);
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
