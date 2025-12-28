import { useState, useEffect, useCallback } from 'react';
import type { Region } from '../types';

export interface RecentSearch {
  destination: string;
  region: Region;
  maxResults: number;
  departureDate?: string;
  returnDate?: string;
  timestamp: number;
  // Results data (populated after search completes)
  cheapestPrice?: {
    amount: number;
    currency: string;
  };
  cheapestOrigin?: string; // IATA code of cheapest departure airport
  resultsCount?: number;
}

const STORAGE_KEY = 'trip-scanner-recent-searches';
const MAX_RECENT_SEARCHES = 5;

/**
 * Hook to manage recent searches with localStorage
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const searches = JSON.parse(stored) as RecentSearch[];
        setRecentSearches(searches);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const saveSearch = useCallback((search: Omit<RecentSearch, 'timestamp'>) => {
    try {
      const newSearch: RecentSearch = {
        ...search,
        timestamp: Date.now(),
      };

      setRecentSearches((prevSearches) => {
        // Remove duplicate searches (same destination + region)
        const filtered = prevSearches.filter(
          (s) => !(s.destination === search.destination && s.region === search.region)
        );

        // Add new search at the beginning
        const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  }, []);

  const updateSearchWithResults = useCallback((
    destination: string,
    region: Region,
    results: {
      cheapestPrice: { amount: number; currency: string };
      cheapestOrigin: string;
      resultsCount: number;
    }
  ) => {
    try {
      setRecentSearches((prevSearches) => {
        const updated = prevSearches.map((search) => {
          if (search.destination === destination && search.region === region) {
            // Check if we already have this data to prevent unnecessary updates
            if (
              search.cheapestPrice?.amount === results.cheapestPrice.amount &&
              search.cheapestOrigin === results.cheapestOrigin
            ) {
              return search;
            }
            return {
              ...search,
              cheapestPrice: results.cheapestPrice,
              cheapestOrigin: results.cheapestOrigin,
              resultsCount: results.resultsCount,
            };
          }
          return search;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to update search with results:', error);
    }
  }, []);

  const clearRecentSearches = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }, []);

  return {
    recentSearches,
    saveSearch,
    updateSearchWithResults,
    clearRecentSearches,
  };
}