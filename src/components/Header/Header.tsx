import React from "react";
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
        <Button
          as={Link}
          to="/"
          variant="ghost"
          lineHeight="1.55"
          borderRadius="4px"
          fontSize="18px"
          fontWeight="semibold"
          color="#000000"
          fontFamily="Archivo, sans-serif"
          p="0.5em 0.7em"
          _hover={{
            bg: "green.100",
            textDecoration: "none",
            outline: "none",
          }}
          _focus={{
            outline: "none",
            boxShadow: "none",
          }}
        >
          Resources
        </Button>
        <Button
          as={Link}
          to="/favorites"
          variant="ghost"
          lineHeight="1.55"
          borderRadius="4px"
          fontSize="18px"
          fontWeight="semibold"
          color="#000000"
          fontFamily="Archivo, sans-serif"
          p="0.5em 0.7em"
          _hover={{
            bg: "green.100",
            textDecoration: "none",
            outline: "none",
          }}
          _focus={{
            outline: "none",
            boxShadow: "none",
          }}
        >
          My Favorites
        </Button>
        <Button
          as={Link}
          to="/"
          variant="ghost"
          lineHeight="1.55"
          borderRadius="4px"
          fontSize="18px"
          fontWeight="semibold"
          color="#000000"
          fontFamily="Archivo, sans-serif"
          p="0.5em 0.7em"
          _hover={{
            bg: "green.100",
            textDecoration: "none",
            outline: "none",
          }}
          _focus={{
            outline: "none",
            boxShadow: "none",
          }}
        >
          Login
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
