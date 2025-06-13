// src/components/School/SchoolDetailPanel.tsx
import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Divider,
  Icon,
  HStack,
  List,
  ListItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IoReturnUpBack, IoSchoolOutline } from "react-icons/io5";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

const formatKey = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

interface SchoolDetailPanelProps {
  school: NCESSchoolFeatureAttributes;
  onClose: () => void;
}

export const SchoolDetailPanel: React.FC<SchoolDetailPanelProps> = ({
  school,
  onClose,
}) => {
  return (
    <VStack
      as={motion.div}
      spacing={6}
      align="stretch"
      p={8}
      borderRadius="2xl"
      boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
      bg="gray.50"
      overflowY="auto"
      sx={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        position: "absolute",
        width: "100%",
        height: "800px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onClose}
            leftIcon={<Icon as={IoReturnUpBack as any} />}
            size="lg"
            colorScheme="blue"
            variant="ghost"
            borderRadius="full"
            px={6}
            mb={4}
          >
            Back to List
          </Button>
        </motion.div>
        <Divider mb={6} />
        <VStack align="start" spacing={6}>
          <HStack>
            <Icon as={IoSchoolOutline as any} color="blue.500" boxSize={8} />
            <Heading as="h3" size="xl" color="blue.600">
              {school.NAME}
            </Heading>
          </HStack>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="md" w="full">
            <List spacing={3} fontSize="sm">
              {Object.entries(school).map(
                ([key, value]) =>
                  value && (
                    <ListItem
                      p={3}
                      bg="gray.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      _hover={{
                        bg: "blue.50",
                        borderColor: "blue.200",
                      }}
                      transition="all 0.2s"
                    >
                      <HStack justify="space-between">
                        <Text fontWeight="bold" color="gray.700">
                          {formatKey(key)}:
                        </Text>
                        <Text color="gray.600">{value}</Text>
                      </HStack>
                    </ListItem>
                  )
              )}
            </List>
          </Box>
        </VStack>
      </motion.div>
    </VStack>
  );
};
