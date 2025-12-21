import { useMutation } from '@tanstack/react-query';
import { flightService } from '../api/flightService';
import type { SearchRequest, FlightSearchResponse } from '../types';

/**
 * Custom hook for flight search
 * Uses React Query's useMutation for POST requests
 *
 * @returns Mutation object with mutate, data, isPending, isError, error
 *
 * @example
 * const { mutate, data, isPending, isError } = useFlightSearch();
 * mutate({ destination: 'BKK', region: 'EUROPE', maxResults: 10 });
 */
export function useFlightSearch() {
  return useMutation<FlightSearchResponse, Error, SearchRequest>({
    mutationFn: flightService.searchFlights,
    // Optional: Add onSuccess/onError callbacks here if needed
    onSuccess: (data) => {
      console.log(`[Search] Found ${data.resultCount} results for ${data.destination}`);
    },
    onError: (error) => {
      console.error('[Search] Failed:', error.message);
    },
  });
}