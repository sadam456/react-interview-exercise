// src/components/School/ComparisonModal.tsx
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Grid,
  GridItem,
  Heading,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolsToCompare: NCESSchoolFeatureAttributes[];
}

const Stat = ({ label, value }: { label: string; value?: string | number }) => (
  <Box>
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text fontSize="lg" fontWeight="bold">
      {value || "N/A"}
    </Text>
  </Box>
);

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  schoolsToCompare,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>School Comparison</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Grid
            templateColumns={`repeat(${schoolsToCompare.length}, 1fr)`}
            gap={6}
          >
            {schoolsToCompare.map((school) => (
              <GridItem key={school.NCESSCH}>
                <VStack
                  align="stretch"
                  spacing={4}
                  bg="gray.50"
                  p={4}
                  borderRadius="lg"
                >
                  <Heading size="sm" noOfLines={3}>
                    {school.NAME}
                  </Heading>
                  <Divider />
                  <Stat label="City" value={school.CITY} />
                  <Stat label="State" value={school.STATE} />
                  <Stat label="Locale" value={school.LOCALE} />
                </VStack>
              </GridItem>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
