import React from "react";
import { Box, Text } from "@chakra-ui/react";

export const SearchPageHeader = () => (
  <Box textAlign="center" py={8}>
    <Text
      as="h1"
      fontSize={{ base: "3xl", md: "5xl" }}
      fontWeight="700"
      lineHeight="1.2"
      bgGradient="linear(to-r, #2D7D32, #4CAF50, #66BB6A)"
      bgClip="text"
      mb={4}
    >
      School District Finder
    </Text>
    <Text
      fontSize={{ base: "lg", md: "xl" }}
      color="gray.600"
      maxWidth="600px"
      mx="auto"
      lineHeight="1.6"
    >
      Discover and explore school districts across the nation. Search by name
      and filter by location to find the perfect educational community.
    </Text>
  </Box>
);
