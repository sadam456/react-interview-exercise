import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box, Text } from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import { Icon } from "leaflet";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
};

interface MapComponentProps {
  schools: NCESSchoolFeatureAttributes[];
  onMarkerClick: (school: NCESSchoolFeatureAttributes) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  schools,
  onMarkerClick,
}) => {
  const mapCenter = React.useMemo(() => {
    if (schools.length === 0) {
      // Default center of the US
      return { lat: 39.8283, lng: -98.5795 };
    }
    const validSchools = schools.filter((s) => s.LAT && s.LON);
    if (validSchools.length === 0) return { lat: 39.8283, lng: -98.5795 };

    const avgLat =
      validSchools.reduce((sum, school) => sum + school.LAT!, 0) /
      validSchools.length;
    const avgLng =
      validSchools.reduce((sum, school) => sum + school.LON!, 0) /
      validSchools.length;

    return { lat: avgLat, lng: avgLng };
  }, [schools]);

  // Determine the zoom level dynamically
  const mapZoom = React.useMemo(() => {
    if (schools.length === 0) {
      return 4; // Zoom out to show the whole US
    }
    if (schools.length === 1) {
      return 13; // Zoom in close for a single school
    }
    return 10; // A good regional zoom for multiple schools
  }, [schools]);

  return (
    <Box sx={{ ".leaflet-container": { borderRadius: "lg" } }}>
      {/* dynamic zoom level */}
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        style={containerStyle}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {schools.map(
          (school) =>
            school.LAT &&
            school.LON && (
              <Marker
                key={school.NCESSCH}
                position={[school.LAT, school.LON]}
                icon={defaultIcon}
              >
                <Popup>
                  <Text
                    onClick={() => onMarkerClick(school)}
                    cursor="pointer"
                    color="blue.500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    {school.NAME}
                  </Text>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </Box>
  );
};
