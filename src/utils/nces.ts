export interface NCESSchoolFeatureAttributes {
  NCESSCH?: string;
  LEAID?: string;
  NAME?: string;
  OPSTFIPS?: string;
  STREET?: string;
  CITY?: string;
  STATE?: string;
  ZIP?: string;
  STFIP?: string;
  CNTY?: string;
  NMCNTY?: string;
  LOCALE?: string;
  LAT?: number;
  LON?: number;
}

interface NCESSchoolFeature {
  attributes?: NCESSchoolFeatureAttributes;
  geometry?: {
    x: number;
    y: number;
  };
}

export interface NCESDistrictFeatureAttributes {
  OBJECTID: number;
  LEAID: string;
  NAME: string;
  OPSTFIPS: string;
  LSTREE: string;
  LCITY: string;
  LSTATE: string;
  LZIP: string;
  LZIP4: string;
  STFIP15: string;
  CNTY15: string;
  NMCNTY15: string;
  LAT1516: number;
  LON1516: number;
  CBSA15: string;
  NMCBSA15: string;
  CBSATYPE15: string;
  CSA15: string;
  NMCSA15: string;
  NECTA15: string;
  NMNECTA15: string;
  CD15: string;
  SLDL15: string;
  SLDU15: string;
}

interface NCESDistrictFeature {
  attributes?: NCESDistrictFeatureAttributes;
  geometry?: {
    x: number;
    y: number;
  };
}

// === UPDATED searchSchoolDistricts function ===
const searchSchoolDistricts = async (
  name: string,
  state?: string,
  city?: string
): Promise<NCESDistrictFeatureAttributes[]> => {
  // Start with the base query clauses. A search name is required.
  const whereClauses = [`UPPER(NAME) LIKE UPPER('%${name}%')`];

  // Conditionally add state and city to the query if they are provided
  if (state) {
    // Using LSTATE for state abbreviation
    whereClauses.push(`UPPER(LSTATE) = UPPER('${state}')`);
  }
  if (city) {
    // Using LCITY for city name
    whereClauses.push(`UPPER(LCITY) LIKE UPPER('%${city}%')`);
  }

  // Join all clauses with ' AND '
  const whereQuery = whereClauses.join(" AND ");

  const endpoint = `https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_GEOCODE_PUBLICLEA_1516/MapServer/0/query?where=${whereQuery}&outFields=*&outSR=4326&f=json`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    console.error("Failed to fetch districts", response);
    throw new Error("Network response was not ok for districts");
  }
  const jsonResponse = await response.json();

  return jsonResponse.features
    ? jsonResponse.features.map(
        (feature: NCESDistrictFeature) => feature.attributes
      )
    : [];
};

// === UPDATED searchSchools function ===
const searchSchools = async (
  name: string,
  district?: string,
  city?: string
): Promise<NCESSchoolFeatureAttributes[]> => {
  // Base clauses for the school search
  const whereClauses = [`UPPER(NAME) LIKE UPPER('%${name}%')`];

  // Conditionally add district and city filters
  if (district) {
    whereClauses.push(`LEAID = '${district}'`);
  }
  if (city) {
    whereClauses.push(`UPPER(CITY) LIKE UPPER('%${city}%')`);
  }

  // Join all clauses with ' AND '
  const whereQuery = whereClauses.join(" AND ");

  // Define the two endpoints we need to query
  const privateSchoolEndpoint = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Private_School_Locations_Current/FeatureServer/0/query?where=${whereQuery}&outFields=*&outSR=4326&f=json`;
  const publicSchoolEndpoint = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Location_201819/FeatureServer/0/query?where=${whereQuery}&outFields=*&outSR=4326&f=json`;

  // Fetch from both endpoints simultaneously for better performance
  const [privateResponse, publicResponse] = await Promise.all([
    fetch(privateSchoolEndpoint).then((res) => res.json()),
    fetch(publicSchoolEndpoint).then((res) => res.json()),
  ]);

  // Combine the features from both results
  const combinedData = [
    ...(privateResponse.features || []).map(
      (feature: NCESSchoolFeature) => feature.attributes
    ),
    ...(publicResponse.features || []).map(
      (feature: NCESSchoolFeature) => feature.attributes
    ),
  ];

  return combinedData;
};

export { searchSchoolDistricts, searchSchools };
