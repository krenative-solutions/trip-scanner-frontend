export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const airports: Airport[] = [
  // Europe
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'LON', name: 'All London Airports', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'PAR', name: 'All Paris Airports', city: 'Paris', country: 'France' },
  { code: 'AMS', name: 'Schiphol Airport', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'MAD', name: 'Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona Airport', city: 'Barcelona', country: 'Spain' },
  { code: 'FCO', name: 'Fiumicino Airport', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy' },
  { code: 'VCE', name: 'Marco Polo Airport', city: 'Venice', country: 'Italy' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { code: 'VIE', name: 'Vienna Airport', city: 'Vienna', country: 'Austria' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { code: 'ARN', name: 'Arlanda Airport', city: 'Stockholm', country: 'Sweden' },
  { code: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norway' },
  { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland' },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },
  { code: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal' },
  { code: 'ATH', name: 'Athens Airport', city: 'Athens', country: 'Greece' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { code: 'PRG', name: 'Prague Airport', city: 'Prague', country: 'Czech Republic' },
  { code: 'BUD', name: 'Budapest Airport', city: 'Budapest', country: 'Hungary' },
  { code: 'WAW', name: 'Warsaw Airport', city: 'Warsaw', country: 'Poland' },

  // North America
  { code: 'JFK', name: 'John F. Kennedy Airport', city: 'New York', country: 'United States' },
  { code: 'NYC', name: 'All New York Airports', city: 'New York', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles Airport', city: 'Los Angeles', country: 'United States' },
  { code: 'ORD', name: "O'Hare Airport", city: 'Chicago', country: 'United States' },
  { code: 'CHI', name: 'All Chicago Airports', city: 'Chicago', country: 'United States' },
  { code: 'SFO', name: 'San Francisco Airport', city: 'San Francisco', country: 'United States' },
  { code: 'MIA', name: 'Miami Airport', city: 'Miami', country: 'United States' },
  { code: 'DFW', name: 'Dallas Fort Worth Airport', city: 'Dallas', country: 'United States' },
  { code: 'SEA', name: 'Seattle-Tacoma Airport', city: 'Seattle', country: 'United States' },
  { code: 'LAS', name: 'Las Vegas Airport', city: 'Las Vegas', country: 'United States' },
  { code: 'BOS', name: 'Logan Airport', city: 'Boston', country: 'United States' },
  { code: 'IAD', name: 'Dulles Airport', city: 'Washington DC', country: 'United States' },
  { code: 'WAS', name: 'All Washington DC Airports', city: 'Washington DC', country: 'United States' },
  { code: 'ATL', name: 'Hartsfield-Jackson Airport', city: 'Atlanta', country: 'United States' },
  { code: 'DEN', name: 'Denver Airport', city: 'Denver', country: 'United States' },
  { code: 'PHX', name: 'Phoenix Airport', city: 'Phoenix', country: 'United States' },
  { code: 'YYZ', name: 'Toronto Pearson Airport', city: 'Toronto', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver Airport', city: 'Vancouver', country: 'Canada' },
  { code: 'YUL', name: 'Montreal Airport', city: 'Montreal', country: 'Canada' },
  { code: 'MEX', name: 'Mexico City Airport', city: 'Mexico City', country: 'Mexico' },
  { code: 'CUN', name: 'Cancun Airport', city: 'Cancun', country: 'Mexico' },

  // Asia
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'NRT', name: 'Narita Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'TOK', name: 'All Tokyo Airports', city: 'Tokyo', country: 'Japan' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'SEL', name: 'All Seoul Airports', city: 'Seoul', country: 'South Korea' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'PVG', name: 'Pudong Airport', city: 'Shanghai', country: 'China' },
  { code: 'SHA', name: 'All Shanghai Airports', city: 'Shanghai', country: 'China' },
  { code: 'PEK', name: 'Beijing Capital Airport', city: 'Beijing', country: 'China' },
  { code: 'BJS', name: 'All Beijing Airports', city: 'Beijing', country: 'China' },
  { code: 'KUL', name: 'Kuala Lumpur Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'CGK', name: 'Soekarno-Hatta Airport', city: 'Jakarta', country: 'Indonesia' },
  { code: 'MNL', name: 'Ninoy Aquino Airport', city: 'Manila', country: 'Philippines' },
  { code: 'DEL', name: 'Indira Gandhi Airport', city: 'New Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Airport', city: 'Mumbai', country: 'India' },
  { code: 'DXB', name: 'Dubai Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'DOH', name: 'Hamad Airport', city: 'Doha', country: 'Qatar' },
  { code: 'HAN', name: 'Noi Bai Airport', city: 'Hanoi', country: 'Vietnam' },
  { code: 'SGN', name: 'Tan Son Nhat Airport', city: 'Ho Chi Minh City', country: 'Vietnam' },
  { code: 'TPE', name: 'Taoyuan Airport', city: 'Taipei', country: 'Taiwan' },

  // Oceania
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },
  { code: 'CHC', name: 'Christchurch Airport', city: 'Christchurch', country: 'New Zealand' },

  // South America
  { code: 'GRU', name: 'Guarulhos Airport', city: 'São Paulo', country: 'Brazil' },
  { code: 'SAO', name: 'All São Paulo Airports', city: 'São Paulo', country: 'Brazil' },
  { code: 'GIG', name: 'Galeão Airport', city: 'Rio de Janeiro', country: 'Brazil' },
  { code: 'RIO', name: 'All Rio de Janeiro Airports', city: 'Rio de Janeiro', country: 'Brazil' },
  { code: 'EZE', name: 'Ministro Pistarini Airport', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'BUE', name: 'All Buenos Aires Airports', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'BOG', name: 'El Dorado Airport', city: 'Bogotá', country: 'Colombia' },
  { code: 'LIM', name: 'Jorge Chávez Airport', city: 'Lima', country: 'Peru' },
  { code: 'SCL', name: 'Arturo Merino Benítez Airport', city: 'Santiago', country: 'Chile' },

  // Africa
  { code: 'JNB', name: 'O.R. Tambo Airport', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CPT', name: 'Cape Town Airport', city: 'Cape Town', country: 'South Africa' },
  { code: 'CAI', name: 'Cairo Airport', city: 'Cairo', country: 'Egypt' },
  { code: 'CMN', name: 'Mohammed V Airport', city: 'Casablanca', country: 'Morocco' },
  { code: 'NBO', name: 'Jomo Kenyatta Airport', city: 'Nairobi', country: 'Kenya' },
  { code: 'LOS', name: 'Murtala Muhammed Airport', city: 'Lagos', country: 'Nigeria' },
];

/**
 * Search airports by code, city, or airport name
 */
export function searchAirports(query: string, limit = 10): Airport[] {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();

  const matches = airports.filter(airport =>
    airport.code.toLowerCase().includes(normalizedQuery) ||
    airport.city.toLowerCase().includes(normalizedQuery) ||
    airport.name.toLowerCase().includes(normalizedQuery) ||
    airport.country.toLowerCase().includes(normalizedQuery)
  );

  return matches.slice(0, limit);
}

/**
 * Get airport by IATA code
 */
export function getAirportByCode(code: string): Airport | undefined {
  return airports.find(airport => airport.code.toLowerCase() === code.toLowerCase());
}
