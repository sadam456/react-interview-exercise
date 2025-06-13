// src/components/School/DistrictSidebar.tsx
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
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  IoArrowBack,
  IoSchoolOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { MapComponent } from "@components/Map/MapComponent";
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
} from "@utils/nces";
import { itemVariants } from "../design/AnimationVariants";

interface DistrictSidebarProps {
  district: NCESDistrictFeatureAttributes;
  schools: NCESSchoolFeatureAttributes[];
  isLoading: boolean;
  onBack: () => void;
  onMarkerClick: (school: NCESSchoolFeatureAttributes) => void;
}

export const DistrictSidebar: React.FC<DistrictSidebarProps> = ({
  district,
  schools,
  isLoading,
  onBack,
  onMarkerClick,
}) => {
  return (
    <motion.div variants={itemVariants}>
      <VStack spacing={6} align="stretch" height="100%">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onBack}
            leftIcon={<Icon as={IoArrowBack as any} />}
            size="lg"
            variant="ghost"
            colorScheme="blue"
            borderRadius="full"
            px={6}
            _hover={{
              bg: "white",
              boxShadow: "lg",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
          >
            All Districts
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            bg="white"
            p={8}
            borderRadius="2xl"
            boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
            border="1px solid"
            borderColor="blue.100"
            position="sticky"
            top="100px"
          >
            <VStack align="start" spacing={4}>
              <HStack>
                <Icon
                  as={IoSchoolOutline as any}
                  color="blue.500"
                  boxSize={6}
                />
                <Heading as="h2" size="lg" color="blue.600">
                  {district.NAME}
                </Heading>
              </HStack>
              <HStack>
                <Icon
                  as={IoLocationOutline as any}
                  color="gray.500"
                  boxSize={5}
                />
                <Text fontSize="lg" color="gray.700" fontWeight="500">
                  {district.LCITY}, {district.LSTATE}
                </Text>
              </HStack>
              <Divider />
              <VStack align="start" spacing={2}>
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  ID: {district.LEAID}
                </Badge>
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  County: {district.NMCNTY15}
                </Badge>
              </VStack>
            </VStack>
          </Box>
        </motion.div>

        {!isLoading && schools.length > 0 && (
          <motion.div variants={itemVariants} style={{ flex: 1 }}>
            <Box
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              h="100%"
            >
              <MapComponent schools={schools} onMarkerClick={onMarkerClick} />
            </Box>
          </motion.div>
        )}
      </VStack>
    </motion.div>
  );
};
