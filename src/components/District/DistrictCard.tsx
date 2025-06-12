import React from "react";
import { Heading, Text, VStack, Divider, Box } from "@chakra-ui/react";
import { NCESDistrictFeatureAttributes } from "@utils/nces";

interface DistrictCardProps {
  district: NCESDistrictFeatureAttributes;
  onClick: () => void;
}

export const DistrictCard: React.FC<DistrictCardProps> = ({
  district,
  onClick,
}) => {
  return (
    <VStack
      onClick={onClick}
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
      <VStack spacing={1} textAlign="center" flex={1} justify="center">
        <Heading size="sm">{district.NAME}</Heading>
        <Text fontSize="sm" color="gray.600">
          {district.LCITY}, {district.LSTATE}
        </Text>
      </VStack>
      <Divider />
      <Text fontSize="xs" color="blue.500" textAlign="center">
        Select this district
      </Text>
    </VStack>
  );
};
