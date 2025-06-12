import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import { IoSchool } from "react-icons/io5";

const formatKey = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

interface SchoolCardProps {
  school: NCESSchoolFeatureAttributes;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Box
      perspective="1000px"
      onClick={() => setIsFlipped(!isFlipped)}
      cursor="pointer"
    >
      <motion.div
        style={{
          position: "relative",
          width: "100%",
          height: "250px",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card Front */}
        <VStack
          as={motion.div}
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          spacing={3}
          align="stretch"
          height="100%"
          justify="center"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
          }}
        >
          <Icon as={IoSchool as any} boxSize={8} color="blue.500" />
          <VStack spacing={1} textAlign="center">
            <Heading size="sm">{school.NAME}</Heading>
            <Text fontSize="sm" color="gray.600">
              {school.CITY}, {school.STATE}
            </Text>
          </VStack>
          <Divider />
          <Text fontSize="xs" color="blue.500" textAlign="center">
            Click for details
          </Text>
        </VStack>

        {/* Card Back */}
        <VStack
          as={motion.div}
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg="gray.50"
          spacing={2}
          align="stretch"
          height="100%"
          overflowY="auto"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Heading size="sm" mb={2}>
            {school.NAME}
          </Heading>
          <List spacing={1} fontSize="xs">
            {Object.entries(school).map(
              ([key, value]) =>
                value && (
                  <ListItem key={key}>
                    <strong>{formatKey(key)}:</strong> {value}
                  </ListItem>
                )
            )}
          </List>
        </VStack>
      </motion.div>
    </Box>
  );
};
