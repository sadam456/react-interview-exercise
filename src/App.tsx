import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Header from "@components/Header/Header";
import Home from "@components/Home";
import { SchoolView } from "@components/School/SchoolView";
import { FavoritesPage } from "@components/Favorites/FavoritesPage";
import Glob from "@components/design/Glob";
import { theme } from "@theme/index";

function App() {
  return (
    <Box position="relative" bg="#f4f6f8">
      {/*The Animated Background --- */}
      <Box
        overflow="hidden"
        className="globParent"
        position="absolute"
        width="100vw"
        height="100%"
        minHeight="100vh"
        zIndex={0}
      >
        <Glob
          size={["60%", "60%"]}
          speed={30}
          globSizes={[
            [60, 65],
            [70, 80],
            [30, 75],
          ]}
          left="0%"
          top="10%"
          opacity={0.5}
          color={theme.colors.brand.green}
        />
        <Glob
          size={["600px", "600px"]}
          left="-50px"
          top="-20px"
          color={theme.colors.brand.green}
        />
      </Box>
      {/*All Application Content --- */}
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        flexDirection="column"
        minH="100vh"
      >
        <Header />
        <Box as="main" pt="100px" px={{ base: "24px", md: "48px" }} flex="1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/district/:districtId" element={<SchoolView />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
