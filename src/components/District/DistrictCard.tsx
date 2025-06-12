import React from "react";
import { Heading, Text, VStack, Divider, Box } from "@chakra-ui/react";
import { NCESDistrictFeatureAttributes } from "@utils/nces";
import { Link } from "react-router-dom";

interface DistrictCardProps {
  district: NCESDistrictFeatureAttributes;
}

export const DistrictCard: React.FC<DistrictCardProps> = ({ district }) => {
  return (
    <Box
      as={Link}
      to={`/district/${district.LEAID}`}
      state={{ district }}
      _hover={{ textDecoration: "none" }}
    >
      <VStack
        spacing={3}
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
        transition="all 0.2s ease-in-out"
        align="stretch"
        height="100%"
        cursor="pointer"
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
    </Box>
  );
};
