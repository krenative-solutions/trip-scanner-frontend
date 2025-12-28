/**
 * Airport coordinates for map display
 * Coordinates are [latitude, longitude]
 */
export const airportCoordinates: Record<string, [number, number]> = {
  // Europe
  'LHR': [51.4700, -0.4543], // London Heathrow
  'LON': [51.5074, -0.1278], // London (city center)
  'CDG': [49.0097, 2.5479], // Paris Charles de Gaulle
  'PAR': [48.8566, 2.3522], // Paris (city center)
  'AMS': [52.3105, 4.7683], // Amsterdam Schiphol
  'FRA': [50.0379, 8.5622], // Frankfurt
  'MAD': [40.4719, -3.5626], // Madrid
  'BCN': [41.2974, 2.0833], // Barcelona
  'FCO': [41.8003, 12.2389], // Rome Fiumicino
  'MXP': [45.6301, 8.7231], // Milan Malpensa
  'VCE': [45.5053, 12.3519], // Venice
  'MUC': [48.3537, 11.7750], // Munich
  'ZRH': [47.4582, 8.5556], // Zurich
  'VIE': [48.1103, 16.5697], // Vienna
  'CPH': [55.6180, 12.6508], // Copenhagen
  'ARN': [59.6519, 17.9186], // Stockholm
  'OSL': [60.1939, 11.1004], // Oslo
  'HEL': [60.3183, 24.9633], // Helsinki
  'DUB': [53.4213, -6.2700], // Dublin
  'LIS': [38.7742, -9.1342], // Lisbon
  'ATH': [37.9364, 23.9445], // Athens
  'IST': [41.2753, 28.7519], // Istanbul
  'PRG': [50.1008, 14.2632], // Prague
  'BUD': [47.4298, 19.2610], // Budapest
  'WAW': [52.1657, 20.9671], // Warsaw

  // North America
  'JFK': [40.6413, -73.7781], // New York JFK
  'NYC': [40.7128, -74.0060], // New York (city center)
  'LAX': [33.9416, -118.4085], // Los Angeles
  'ORD': [41.9742, -87.9073], // Chicago O'Hare
  'CHI': [41.8781, -87.6298], // Chicago (city center)
  'SFO': [37.6213, -122.3790], // San Francisco
  'MIA': [25.7959, -80.2870], // Miami
  'DFW': [32.8998, -97.0403], // Dallas Fort Worth
  'SEA': [47.4502, -122.3088], // Seattle
  'LAS': [36.0840, -115.1537], // Las Vegas
  'BOS': [42.3656, -71.0096], // Boston
  'IAD': [38.9531, -77.4565], // Washington Dulles
  'WAS': [38.9072, -77.0369], // Washington DC (city center)
  'ATL': [33.6407, -84.4277], // Atlanta
  'DEN': [39.8561, -104.6737], // Denver
  'PHX': [33.4352, -112.0080], // Phoenix
  'YYZ': [43.6777, -79.6248], // Toronto
  'YVR': [49.1939, -123.1844], // Vancouver
  'YUL': [45.4707, -73.7408], // Montreal
  'MEX': [19.4361, -99.0719], // Mexico City
  'CUN': [21.0365, -86.8771], // Cancun

  // Asia
  'BKK': [13.6900, 100.7501], // Bangkok
  'NRT': [35.7720, 140.3929], // Tokyo Narita
  'TOK': [35.6762, 139.6503], // Tokyo (city center)
  'HND': [35.5494, 139.7798], // Tokyo Haneda
  'ICN': [37.4602, 126.4407], // Seoul Incheon
  'SEL': [37.5665, 126.9780], // Seoul (city center)
  'SIN': [1.3644, 103.9915], // Singapore
  'HKG': [22.3080, 113.9185], // Hong Kong
  'PVG': [31.1443, 121.8083], // Shanghai Pudong
  'SHA': [31.2304, 121.4737], // Shanghai (city center)
  'PEK': [40.0799, 116.6031], // Beijing Capital
  'BJS': [39.9042, 116.4074], // Beijing (city center)
  'KUL': [2.7456, 101.7072], // Kuala Lumpur
  'CGK': [-6.1256, 106.6559], // Jakarta
  'MNL': [14.5086, 121.0194], // Manila
  'DEL': [28.5562, 77.1000], // New Delhi
  'BOM': [19.0896, 72.8656], // Mumbai
  'DXB': [25.2532, 55.3657], // Dubai
  'DOH': [25.2731, 51.6080], // Doha
  'HAN': [21.2187, 105.8042], // Hanoi
  'SGN': [10.8188, 106.6519], // Ho Chi Minh City
  'TPE': [25.0797, 121.2342], // Taipei

  // Oceania
  'SYD': [-33.9399, 151.1753], // Sydney
  'MEL': [-37.6690, 144.8410], // Melbourne
  'BNE': [-27.3942, 153.1218], // Brisbane
  'PER': [-31.9385, 115.9672], // Perth
  'AKL': [-37.0082, 174.7850], // Auckland
  'CHC': [-43.4894, 172.5320], // Christchurch

  // South America
  'GRU': [-23.4283, -46.4752], // São Paulo Guarulhos
  'SAO': [-23.5505, -46.6333], // São Paulo (city center)
  'GIG': [-22.8099, -43.2505], // Rio de Janeiro
  'RIO': [-22.9068, -43.1729], // Rio de Janeiro (city center)
  'EZE': [-34.8222, -58.5358], // Buenos Aires
  'BUE': [-34.6037, -58.3816], // Buenos Aires (city center)
  'BOG': [4.7016, -74.1469], // Bogotá
  'LIM': [-12.0219, -77.1143], // Lima
  'SCL': [-33.3930, -70.7858], // Santiago

  // Africa
  'JNB': [-26.1392, 28.2460], // Johannesburg
  'CPT': [-33.9690, 18.5970], // Cape Town
  'CAI': [30.1219, 31.4056], // Cairo
  'CMN': [33.3670, -7.5900], // Casablanca
  'NBO': [-1.3192, 36.9278], // Nairobi
  'LOS': [6.5774, 3.3213], // Lagos
};

/**
 * Get coordinates for an airport code
 * Returns [0, 0] if coordinates not found
 */
export function getAirportCoordinates(code: string): [number, number] {
  return airportCoordinates[code.toUpperCase()] || [0, 0];
}

/**
 * Check if an airport has coordinates
 */
export function hasAirportCoordinates(code: string): boolean {
  return code.toUpperCase() in airportCoordinates;
}
