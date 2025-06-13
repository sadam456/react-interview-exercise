import React from "react";
import {
  Heading,
  Text,
  VStack,
  Divider,
  Icon,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import { IoSchool, IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useFavorites } from "src/context/FavoritesContext";

interface SchoolCardProps {
  school: NCESSchoolFeatureAttributes;
  onClick: () => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onClick }) => {
  // --- STATE AND CONTEXT HOOKS ---
  // Fetches favorites context to manage this school's saved state.
  const { isSchoolSaved, addSchool, removeSchool } = useFavorites();
  const isSaved = isSchoolSaved(school.NCESSCH as string);

  /**
   * Click handler for the save icon.
   * `event.stopPropagation()` is crucial here to prevent the card's main onClick from firing.
   */
  const handleSaveClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (isSaved) {
      removeSchool(school.NCESSCH as string);
    } else {
      addSchool(school);
    }
  };

  return (
    // The entire card is clickable to trigger the view flip in the parent component.
    <VStack
      onClick={onClick}
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
        cursor: "pointer",
      }}
      transition="all 0.2s ease-in-out"
      align="stretch"
      height="100%"
    >
      {/* Save/favorite icon button, positioned in the top-right corner. */}
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
        size="sm"
        variant="ghost"
        onClick={handleSaveClick}
        position="absolute"
        top="8px"
        right="8px"
        _focus={{
          outline: "none",
          boxShadow: "none",
        }}
      />

      {/* Main content section with school icon, name, and location. */}
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
