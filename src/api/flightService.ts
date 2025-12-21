import { apiClient } from './config';
import type { FlightSearchResponse, SearchRequest } from '../types';

/**
 * Flight API service
 * Handles all flight-related API calls
 */
export const flightService = {
  /**
   * Search for flights to a destination
   * POST /api/v1/search
   *
   * @param request Search parameters (destination, region, maxResults)
   * @returns Flight search results with booking options
   * @throws Error if request fails
   */
  searchFlights: async (request: SearchRequest): Promise<FlightSearchResponse> => {
    const response = await apiClient.post<FlightSearchResponse>('/api/v1/search', request);
    return response.data;
  },

  /**
   * Health check endpoint
   * GET /actuator/health
   *
   * Useful for checking if backend is running
   */
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/actuator/health');
    return response.data;
  },
};