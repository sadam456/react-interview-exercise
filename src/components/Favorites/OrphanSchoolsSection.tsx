import React from "react";
import {
  Box,
  Heading,
  VStack,
  List,
  ListItem,
  Text,
  IconButton,
  Flex,
  Icon,
  Badge,
  Spacer,
} from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import { IoSchool, IoTrash } from "react-icons/io5";

interface OrphanSchoolsSectionProps {
  schools: NCESSchoolFeatureAttributes[];
  removeSchool: (schoolId: string) => void;
}

export const OrphanSchoolsSection: React.FC<OrphanSchoolsSectionProps> = ({
  schools,
  removeSchool,
}) => (
  <VStack spacing={6} align="stretch">
    <Box>
      <Flex align="center" mb={2}>
        <Icon as={IoSchool as any} color="green.500" boxSize={6} mr={3} />
        <Heading as="h2" size="xl" color="gray.700" fontWeight="600">
          Other Saved Schools
        </Heading>
        <Badge
          colorScheme="green"
          variant="subtle"
          ml={3}
          px={2}
          py={1}
          borderRadius="full"
        >
          {schools.length}
        </Badge>
      </Flex>
      <Box
        h="3px"
        w="80px"
        bgGradient="linear(to-r, #2D7D32, #4CAF50)"
        borderRadius="full"
      />
    </Box>
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
    >
      <List spacing={0}>
        {schools.map((school, index) => (
          <ListItem
            key={school.NCESSCH}
            display="flex"
            alignItems="center"
            p={6}
            borderBottom={index < schools.length - 1 ? "1px solid" : "none"}
            borderBottomColor="gray.100"
          >
            <Box flex={1}>
              <Text fontWeight="600" fontSize="lg" color="gray.800" mb={1}>
                {school.NAME}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {school.CITY}, {school.STATE}
              </Text>
            </Box>
            <IconButton
              aria-label="Remove school"
              icon={<Icon as={IoTrash as any} />}
              size="md"
              colorScheme="red"
              variant="ghost"
              borderRadius="full"
              onClick={() => removeSchool(school.NCESSCH as string)}
              _focus={{
                outline: "none",
                boxShadow: "none", // Also remove any box shadow
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  </VStack>
);
