import React from "react";
import {
  Box,
  Input,
  VStack,
  InputGroup,
  InputLeftElement,
  Icon,
  HStack,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IoSearch, IoTimeOutline } from "react-icons/io5";

// This component now receives a lot of props to manage the controlled inputs
interface SearchControlsProps {
  nameQuery: string;
  setNameQuery: (value: string) => void;
  cityQuery: string;
  setCityQuery: (value: string) => void;
  selectedState: string | null;
  setSelectedState: (value: string | null) => void;
  searchHistory: string[];
  isHistoryVisible: boolean;
  setIsHistoryVisible: (visible: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  stateOptions: { label: string; value: string }[];
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  nameQuery,
  setNameQuery,
  cityQuery,
  setCityQuery,
  selectedState,
  setSelectedState,
  searchHistory,
  isHistoryVisible,
  setIsHistoryVisible,
  inputRef,
  handleKeyDown,
  stateOptions,
}) => (
  <VStack
    position="relative"
    spacing={6}
    bg="white"
    p={8}
    borderRadius="2xl"
    boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    border="1px solid"
    borderColor="gray.100"
  >
    <Box position="relative" width="100%">
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none" h="14">
          <Icon as={IoSearch as any} color="green.500" boxSize={5} />
        </InputLeftElement>
        <Input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          placeholder="Search by District Name..."
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          h="14"
          fontSize="md"
          bg="gray.50"
          border="2px solid"
          borderColor="gray.200"
          borderRadius="xl"
          _hover={{ borderColor: "green.300", bg: "white" }}
          _focus={{
            borderColor: "green.500",
            bg: "white",
            boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.1)",
          }}
          onFocus={() => setIsHistoryVisible(true)}
          onBlur={() => setTimeout(() => setIsHistoryVisible(false), 150)}
        />
      </InputGroup>
      {isHistoryVisible && searchHistory.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          mt={2}
          bg="white"
          width="100%"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          borderRadius="xl"
          zIndex="dropdown"
          p={3}
          border="1px solid"
          borderColor="gray.100"
        >
          <List spacing={1}>
            {searchHistory.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setNameQuery(item);
                  setIsHistoryVisible(false);
                }}
                p={3}
                borderRadius="lg"
                _hover={{
                  bg: "green.50",
                  cursor: "pointer",
                  transform: "translateX(4px)",
                }}
                display="flex"
                alignItems="center"
                transition="all 0.2s ease"
              >
                <Icon
                  as={IoTimeOutline as any}
                  mr={3}
                  color="green.500"
                  boxSize={4}
                />
                <Text color="gray.700" fontSize="sm">
                  {item}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
    <HStack width="100%" spacing={4}>
      <Input
        placeholder="Filter by City..."
        value={cityQuery}
        onChange={(e) => setCityQuery(e.target.value)}
        h="12"
        bg="gray.50"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="xl"
      />
      <Select
        name="state-select"
        options={stateOptions}
        placeholder="Filter by State"
        isClearable
        value={
          stateOptions.find((option) => option.value === selectedState) || null
        }
        onChange={(selectedOption) =>
          setSelectedState(selectedOption ? selectedOption.value : null)
        }
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
          }),
          control: (provided) => ({
            ...provided,
            minHeight: "48px",
            borderRadius: "12px",
            borderWidth: "2px",
            borderColor: "#E2E8F0",
            backgroundColor: "#F7FAFC",
            _hover: {
              borderColor: "#81C784",
              backgroundColor: "white",
            },
            _focus: {
              borderColor: "#4CAF50",
              backgroundColor: "white",
              boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.1)",
            },
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "#4CAF50"
              : state.isFocused
              ? "#E8F5E8"
              : "white",
            color: state.isSelected ? "white" : "#2D3748",
            _hover: {
              backgroundColor: "#E8F5E8",
            },
          }),
        }}
      />
    </HStack>
  </VStack>
);
