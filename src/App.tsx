import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react"; // <-- Import Box
import Header from "@components/Header/Header";
import Home from "@components/Home";
import { SchoolView } from "@components/School/SchoolView";
import { FavoritesPage } from "@components/Favorites/FavoritesPage";

function App() {
  return (
    <div className="App">
      <Header />
      {/* Create a main content container with padding */}
      <Box as="main" pt="100px" px={{ base: "24px", md: "48px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/district/:districtId" element={<SchoolView />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Box>
    </div>
  );
}

export default App;
