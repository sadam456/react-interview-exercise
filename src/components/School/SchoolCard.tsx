import React from "react";
import {
  Heading,
  Text,
  VStack,
  Divider,
  Icon,
  Button,
  IconButton, // <-- Import IconButton
} from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import { IoSchool, IoBookmark, IoBookmarkOutline } from "react-icons/io5"; // <-- Import star icons
import { useFavorites } from "src/context/FavoritesContext"; // <-- Import our hook

interface SchoolCardProps {
  school: NCESSchoolFeatureAttributes;
  onClick: () => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onClick }) => {
  // 1. Get the school-specific functions from our context
  const { isSchoolSaved, addSchool, removeSchool } = useFavorites();
  const isSaved = isSchoolSaved(school.NCESSCH as string);

  // 2. Create the click handler for the save icon
  const handleSaveClick = (event: React.MouseEvent) => {
    // This is crucial to stop the main onClick from firing
    event.stopPropagation();

    if (isSaved) {
      removeSchool(school.NCESSCH as string);
    } else {
      addSchool(school);
    }
  };

  return (
    <VStack
      onClick={onClick}
      position="relative" // <-- Add position relative for the icon
      spacing={3}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      bg="white"
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-2px)",
        cursor: "pointer",
      }}
      transition="all 0.2s ease-in-out"
      align="stretch"
      height="100%"
    >
      {/* 3. The new IconButton for saving schools */}
      <IconButton
        aria-label={
          isSaved ? "Remove school from favorites" : "Save school to favorites"
        }
        icon={
          <Icon
            as={isSaved ? IoBookmark : (IoBookmarkOutline as any)}
            color="black.400"
          />
        }
        isRound
        size="md"
        variant="ghost"
        onClick={handleSaveClick}
        position="absolute"
        top="8px"
        right="8px"
      />

      <Icon
        as={IoSchool as any}
        boxSize={8}
        color="blue.500"
        alignSelf="center"
        pt={4}
      />
      <VStack spacing={1} textAlign="center" flex={1} justify="center">
        <Heading size="sm">{school.NAME}</Heading>
        <Text fontSize="sm" color="gray.600">
          {school.CITY}, {school.STATE}
        </Text>
      </VStack>
      <Divider />
      <Button
        as="span"
        variant="outline"
        size="sm"
        colorScheme="blue"
        pointerEvents="none"
      >
        Click for details
      </Button>
    </VStack>
  );
};
