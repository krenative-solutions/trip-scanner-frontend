// TypeScript types matching backend API response
// Ensures type safety between frontend and backend

/**
 * Main flight search response from /api/v1/search endpoint
 */
export interface FlightSearchResponse {
  destination: string;
  currency: string;
  generatedAt: string;
  resultCount: number;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  results: FlightOffer[];
}

/**
 * Individual flight offer with all details
 */
export interface FlightOffer {
  // Basic info
  origin: string;
  city: string;
  price: number;
  stops: number;
  durationMinutes: number;

  // Phase 1: Booking information (nullable)
  airline: string | null;
  airlineCode: string | null;
  flightNumber: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  bookBy: string | null;

  // Phase 2: Multi-segment support (nullable)
  segments: FlightSegment[] | null;
  layovers: Layover[] | null;

  // Phase 3: Booking links (nullable)
  bookingOptions: BookingOption[] | null;
}

/**
 * Individual flight segment (one leg of journey)
 */
export interface FlightSegment {
  segmentNumber: number;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departure: Location;
  arrival: Location;
  durationMinutes: number;
}

/**
 * Airport location with timing
 */
export interface Location {
  airport: string; // IATA code
  city: string;
  time: string; // ISO-8601 datetime
}

/**
 * Layover/connection information
 */
export interface Layover {
  airport: string;
  city: string;
  durationMinutes: number;
  isShort: boolean; // < 60 minutes (risky)
  isLong: boolean; // > 240 minutes (4+ hours)
  description: string;
}

/**
 * Booking option with link to book flight
 */
export interface BookingOption {
  provider: string; // GOOGLE_FLIGHTS, AIRLINE_DIRECT, KAYAK, etc.
  url: string; // Full HTTPS booking URL
  priority: number; // 1 = highest priority
  displayLabel: string; // User-facing label
  commissionType: 'NONE' | 'AFFILIATE' | 'MARGIN';
  requiresAuthentication: boolean;
}

/**
 * Search request payload
 */
export interface SearchRequest {
  destination: string; // IATA code (e.g., "BKK")
  region: string; // EUROPE, NORTH_AMERICA, etc.
  maxResults: number; // 5-50
}

/**
 * Supported regions for search
 */
export type Region =
  | 'EUROPE'
  | 'NORTH_AMERICA'
  | 'ASIA'
  | 'SOUTH_AMERICA'
  | 'AFRICA'
  | 'OCEANIA';

/**
 * API error response
 */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}