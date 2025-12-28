import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, TrendingDown, Clock } from 'lucide-react';
import { Button, AirportAutocomplete, TripTypeToggle, type TripType } from '../components/ui';
import type { Region } from '../types';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { getAirportByCode } from '../data/airports';

/**
 * SearchPage - Home page with flight search form
 *
 * Improvements over guide:
 * - Added validation feedback
 * - Better UX with examples and help text
 * - Keyboard shortcuts (Enter to submit)
 * - Autofocus on destination field
 */
export function SearchPage() {
  const navigate = useNavigate();
  const { recentSearches, saveSearch, clearRecentSearches } = useRecentSearches();
  const [destination, setDestination] = useState('');
  const [region, setRegion] = useState<Region>('EUROPE');
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [maxResults, setMaxResults] = useState(10);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!destination || destination.length !== 3) {
      setError('Please select a valid destination airport');
      return;
    }

    if (maxResults < 5 || maxResults > 20) {
      setError('Number of results must be between 5 and 20');
      return;
    }

    // Validate dates for round-trip
    if (tripType === 'round-trip' && departureDate && !returnDate) {
      setError('Please select a return date for round-trip flights');
      return;
    }

    if (departureDate && returnDate && returnDate <= departureDate) {
      setError('Return date must be after departure date');
      return;
    }

    // Save search to recent searches
    saveSearch({
      destination,
      region,
      maxResults,
      departureDate: departureDate || undefined,
      returnDate: tripType === 'round-trip' ? returnDate || undefined : undefined,
    });

    // Navigate to results page
    const params = new URLSearchParams({
      destination,
      region,
      maxResults: maxResults.toString(),
    });
    if (departureDate) {
      params.append('departureDate', departureDate);
    }
    if (tripType === 'round-trip' && returnDate) {
      params.append('returnDate', returnDate);
    }
    navigate(`/results?${params.toString()}`);
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value.toUpperCase());
    setError(null);
  };

  const handleTripTypeChange = (type: TripType) => {
    setTripType(type);
    if (type === 'one-way') {
      setReturnDate('');
    }
  };

  const loadRecentSearch = (search: typeof recentSearches[0]) => {
    setDestination(search.destination);
    setRegion(search.region);
    setMaxResults(search.maxResults);
    setDepartureDate(search.departureDate || '');
    setReturnDate(search.returnDate || '');
    setTripType(search.returnDate ? 'round-trip' : 'one-way');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4 shadow-lg">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Trip Scanner
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Find the cheapest departure airports for your destination
          </p>

          {/* Value proposition badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingDown className="w-4 h-4 text-success-600" />
              <span>Compare prices from multiple airports</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Search className="w-4 h-4 text-primary-600" />
              <span>Direct booking links included</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 slide-up overflow-hidden">
            <form onSubmit={handleSearch} className="space-y-5 sm:space-y-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination Airport
                </label>
                <AirportAutocomplete
                  value={destination}
                  onChange={handleDestinationChange}
                  required
                  autoFocus
                />
              </div>

              {/* Region */}
              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Search Region
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           transition-colors"
                >
                  <option value="EUROPE">Europe</option>
                  <option value="NORTH_AMERICA">North America</option>
                  <option value="ASIA">Asia</option>
                  <option value="SOUTH_AMERICA">South America</option>
                  <option value="AFRICA">Africa</option>
                  <option value="OCEANIA">Oceania</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  We'll search for flights departing from airports in this region
                </p>
              </div>

              {/* Trip Type Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trip Type
                </label>
                <TripTypeToggle value={tripType} onChange={handleTripTypeChange} />
              </div>

              {/* Travel Dates */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Travel Dates (Optional)
                </label>
                <div className={`grid gap-3 ${tripType === 'round-trip' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Departure Date */}
                  <div className="relative">
                    <label
                      htmlFor="departureDate"
                      className="block text-xs font-medium text-gray-600 mb-1.5"
                    >
                      Departure
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="departureDate"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        placeholder="Select date"
                        className="w-full px-3 py-2.5 pr-10 border-2 border-gray-300 rounded-lg
                                 focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                                 transition-colors text-sm bg-white"
                      />
                    </div>
                  </div>

                  {/* Return Date - Only show for round-trip */}
                  {tripType === 'round-trip' && (
                    <div className="relative">
                      <label
                        htmlFor="returnDate"
                        className="block text-xs font-medium text-gray-600 mb-1.5"
                      >
                        Return
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="returnDate"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          min={departureDate || new Date().toISOString().split('T')[0]}
                          placeholder="Select date"
                          className="w-full px-3 py-2.5 pr-10 border-2 border-gray-300 rounded-lg
                                   focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                                   transition-colors text-sm bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty for flexible date search
                </p>
              </div>

              {/* Max Results */}
              <div>
                <label
                  htmlFor="maxResults"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Number of Results
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    id="maxResults"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    min={5}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <div className="w-16 text-center">
                    <span className="text-2xl font-bold text-primary-600">{maxResults}</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  More results = longer search time (5-20 results)
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2 text-lg"
              >
                <Search className="w-5 h-5" />
                Search Flights
              </Button>

              {/* Help text */}
              <p className="text-center text-xs text-gray-500">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to search
              </p>
            </form>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-semibold text-gray-700">Recent Searches</p>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-danger-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => {
                  const airport = getAirportByCode(search.destination);
                  const originAirport = search.cheapestOrigin
                    ? getAirportByCode(search.cheapestOrigin)
                    : null;
                  return (
                    <button
                      key={index}
                      onClick={() => loadRecentSearch(search)}
                      className="w-full p-3 bg-white border-2 border-gray-200 rounded-lg
                               hover:border-primary-500 hover:bg-primary-50 transition-colors
                               text-left group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-primary-600">
                              {search.destination}
                            </span>
                            {airport && (
                              <span className="text-xs text-gray-600 truncate">
                                {airport.city}, {airport.country}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span>From {search.region.replace('_', ' ')}</span>
                            {search.departureDate && (
                              <span>
                                {search.returnDate ? 'Round-trip' : 'One-way'} • {search.departureDate}
                                {search.returnDate && ` - ${search.returnDate}`}
                              </span>
                            )}
                            {search.resultsCount && (
                              <span>• {search.resultsCount} results</span>
                            )}
                          </div>
                          {originAirport && (
                            <div className="text-xs text-gray-500 mt-1">
                              Cheapest from {originAirport.code} ({originAirport.city})
                            </div>
                          )}
                        </div>
                        {search.cheapestPrice && (
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-500 mb-0.5">from</div>
                            <div className="text-base font-bold text-success-600 whitespace-nowrap">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: search.cheapestPrice.currency,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(search.cheapestPrice.amount)}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Popular destinations */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['BKK', 'NYC', 'LON', 'PAR', 'TOK', 'SYD'].map((code) => (
                <button
                  key={code}
                  onClick={() => setDestination(code)}
                  className="px-3 py-1 text-sm bg-white border-2 border-gray-200 rounded-lg
                           hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}