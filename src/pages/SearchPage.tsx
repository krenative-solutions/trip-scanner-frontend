import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui';
import type { Region } from '../types';

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
  const [destination, setDestination] = useState('BKK');
  const [region, setRegion] = useState<Region>('EUROPE');
  const [maxResults, setMaxResults] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (destination.length !== 3) {
      setError('Destination must be a 3-letter IATA code');
      return;
    }

    if (maxResults < 5 || maxResults > 20) {
      setError('Number of results must be between 5 and 20');
      return;
    }

    // Navigate to results page
    navigate(`/results?destination=${destination}&region=${region}&maxResults=${maxResults}`);
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value.toUpperCase());
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
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 slide-up">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Destination */}
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Destination Airport
                </label>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  placeholder="e.g., BKK, NYC, LON"
                  maxLength={3}
                  required
                  autoFocus
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           transition-colors uppercase"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter 3-letter IATA code • Examples: BKK (Bangkok), NYC (New York), LON (London)
                </p>
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