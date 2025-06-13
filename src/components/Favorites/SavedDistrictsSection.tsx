import React from "react";
import {
  Box,
  Heading,
  VStack,
  SimpleGrid,
  Flex,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { DistrictCard } from "@components/District/DistrictCard";
import { NCESDistrictFeatureAttributes } from "@utils/nces";
import { IoSchool } from "react-icons/io5";

interface SavedDistrictsSectionProps {
  districts: NCESDistrictFeatureAttributes[];
}

export const SavedDistrictsSection: React.FC<SavedDistrictsSectionProps> = ({
  districts,
}) => (
  <VStack spacing={8} align="stretch">
    <Box>
      <Flex align="center" mb={2}>
        <Icon as={IoSchool as any} color="green.500" boxSize={6} mr={3} />
        <Heading as="h2" size="xl" color="gray.700" fontWeight="600">
          Saved Districts
        </Heading>
        <Badge
          colorScheme="green"
          variant="subtle"
          ml={3}
          px={2}
          py={1}
          borderRadius="full"
        >
          {districts.length}
        </Badge>
      </Flex>
      <Box
        h="3px"
        w="80px"
        bgGradient="linear(to-r, #2D7D32, #4CAF50)"
        borderRadius="full"
      />
    </Box>
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8} p={2}>
      {districts.map((district) => (
        <Box
          key={district.OBJECTID}
          _hover={{ transform: "translateY(-4px)" }}
          transition="all 0.2s ease"
        >
          <DistrictCard district={district} />
        </Box>
      ))}
    </SimpleGrid>
  </VStack>
);
