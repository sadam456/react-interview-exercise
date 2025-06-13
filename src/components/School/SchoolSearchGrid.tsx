// src/components/School/SchoolSearchGrid.tsx
import React from "react";
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  HStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch, IoSchoolOutline } from "react-icons/io5";
import { SchoolCard } from "./SchoolCard";
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import { searchVariants, glowVariants } from "../design/AnimationVariants";

interface SchoolSearchGridProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cityFilter: string;
  setCityFilter: (filter: string) => void;
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  isLoading: boolean;
  filteredSchools: NCESSchoolFeatureAttributes[];
  onSchoolSelect: (school: NCESSchoolFeatureAttributes) => void;
}

export const SchoolSearchGrid: React.FC<SchoolSearchGridProps> = ({
  searchQuery,
  setSearchQuery,
  cityFilter,
  setCityFilter,
  searchFocused,
  setSearchFocused,
  isLoading,
  filteredSchools,
  onSchoolSelect,
}) => {
  return (
    <VStack
      as={motion.div}
      spacing={6}
      align="stretch"
      p={8}
      borderRadius="2xl"
      boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      sx={{
        backfaceVisibility: "hidden",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <VStack spacing={4}>
        <Heading size="lg" color="gray.700" textAlign="center">
          Discover Schools
        </Heading>
        <HStack spacing={4} w="full">
          <motion.div
            style={{ flex: 1 }}
            variants={searchVariants}
            animate={searchFocused ? "focus" : "blur"}
          >
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="blue.400">
                <Icon as={IoSearch as any} />
              </InputLeftElement>
              <Input
                placeholder="Search by School Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                variant="filled"
                disabled={isLoading}
                borderRadius="xl"
                bg="gray.50"
              />
            </InputGroup>
          </motion.div>
          <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }}>
            <Input
              size="lg"
              placeholder="Filter by City..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              variant="filled"
              disabled={isLoading}
              borderRadius="xl"
              bg="gray.50"
            />
          </motion.div>
        </HStack>
      </VStack>

      <Box flex={1} overflowY="auto" display="flex" flexDirection="column">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Flex
                height="100%"
                align="center"
                justify="center"
                direction="column"
                sx={{ spacing: "4" }}
              >
                <motion.div variants={glowVariants} animate="animate">
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                </motion.div>
                <Text color="gray.600" fontSize="lg" mt={4}>
                  Loading schools...
                </Text>
              </Flex>
            </motion.div>
          ) : filteredSchools.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {filteredSchools.map((school, index) => (
                  <motion.div
                    key={school.NCESSCH}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <SchoolCard
                      school={school}
                      onClick={() => onSchoolSelect(school)}
                    />
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1, display: "flex" }}
            >
              <VStack
                spacing={6}
                textAlign="center"
                flex={1}
                p={8}
                justifyContent="center"
                height="100%" // Ensure it can take up the full height
              >
                <Icon
                  as={IoSchoolOutline as any}
                  boxSize={16}
                  color="gray.400"
                />
                <Heading as="h3" size="lg" color="gray.600">
                  No Schools Found
                </Heading>
                <Text color="gray.500" maxW="md">
                  We couldn't find any schools matching your search criteria.
                  Try adjusting your filters or search terms.
                </Text>
              </VStack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </VStack>
  );
};
