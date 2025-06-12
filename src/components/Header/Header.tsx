import React from "react";
// 1. Import Button from Chakra UI
import { Box, Flex, Spacer, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Logo from "../../header_logo.png";

const Header: React.FC = () => {
  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      right="0"
      left="0"
      width="100%"
      height="80px"
      px={{ base: "24px", md: "48px" }}
      bg="rgba(255, 255, 255, 0.84)"
      sx={{
        backdropFilter: "blur(7px)",
      }}
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      boxShadow="sm"
      zIndex="sticky"
    >
      <Flex align="center" height="100%">
        <Box mr="6">
          <a href="https://characterstrong.com">
            <img className="header-img" src={Logo} alt="CharacterStrong Logo" />
          </a>
        </Box>
        <Spacer />

        {/* === UPDATED LINK === */}
        <Button
          as={Link}
          to="/favorites"
          // Use the 'ghost' variant to remove default button background/borders
          variant="ghost"
          // Apply styles from the original website
          lineHeight="1.55"
          borderRadius="4px"
          fontSize="17px"
          fontWeight="normal" // This is equivalent to font-weight: 400
          color="gray.800"
          fontFamily="Archivo, sans-serif" // See note on fonts below
          p="0.5em 0.7em"
          // Remove default button hover effects and add the new one
          _hover={{
            bg: "green.100", // This creates the "box with light greenish color"
            textDecoration: "none",
          }}
        >
          My Favorites
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
