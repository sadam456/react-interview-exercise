import React from "react";
import { Box } from "@chakra-ui/react";
import { DistrictSearch } from "./District/DistrictSearch";

export const Home: React.FC = () => {
  // The outer Box no longer needs padding, as App.tsx handles it now.
  return (
    <Box width="100%">
      <DistrictSearch />
    </Box>
  );
};

export default Home;
