import React from "react";
import { Box, Heading, Text, VStack, Button, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoStar } from "react-icons/io5";

export const EmptyFavoritesState = () => (
  <VStack
    spacing={8}
    bg="white"
    p={16}
    borderRadius="2xl"
    boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    border="1px solid"
    borderColor="gray.100"
    textAlign="center"
  >
    <Box
      w={20}
      h={20}
      bg="green.50"
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={IoStar as any} color="green.500" boxSize={12} />
    </Box>
    <VStack spacing={4}>
      <Heading as="h3" size="lg" color="gray.700">
        No Favorites Yet
      </Heading>
      <Text fontSize="lg" color="gray.600" maxWidth="400px">
        Start building your collection by clicking the star icon on districts
        and schools that interest you.
      </Text>
    </VStack>
    <Button
      as={Link}
      to="/"
      size="lg"
      bgGradient="linear(to-r, #2D7D32, #4CAF50)"
      color="white"
      borderRadius="full"
      px={8}
      _hover={{ bgGradient: "linear(to-r, #1B5E20, #2D7D32)" }}
    >
      Discover Districts
    </Button>
  </VStack>
);
