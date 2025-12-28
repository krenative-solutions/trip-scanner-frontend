import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, RefreshCw, TrendingDown, Map, List, MapPin } from 'lucide-react';
import { useFlightSearch } from '../hooks/useFlightSearch';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { FlightCard, FlightCardSkeleton } from '../components/flight';
import { AirportMap } from '../components/map';
import { Button, Badge } from '../components/ui';
import { formatPrice } from '../lib/formatters';
import type { Region } from '../types';

/**
 * ResultsPage - Displays flight search results
 *
 * Improvements over guide:
 * - Added best deal highlight
 * - Price statistics (cheapest, average)
 * - Better error states
 * - Retry functionality
 * - Result count feedback
 * - Rank numbers on cards
 */
export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destination = searchParams.get('destination') || '';
  const region = searchParams.get('region') || 'EUROPE';
  const maxResults = Number(searchParams.get('maxResults')) || 10;
  const departureDate = searchParams.get('departureDate') || undefined;
  const returnDate = searchParams.get('returnDate') || undefined;

  const { mutate, data, isPending, isError, error, reset } = useFlightSearch();
  const { updateSearchWithResults } = useRecentSearches();
  const lastUpdatedRef = useRef<string | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (destination) {
      mutate({ destination, region, maxResults, departureDate, returnDate });
    }
  }, [destination, region, maxResults, departureDate, returnDate, mutate]);

  // Update recent search with results data when search completes
  useEffect(() => {
    if (data && data.results.length > 0) {
      const cheapestFlight = data.results[0]; // Results are already sorted by price
      const updateKey = `${destination}-${region}-${cheapestFlight.price}`;

      // Only update if we haven't updated this exact data before
      if (lastUpdatedRef.current !== updateKey) {
        lastUpdatedRef.current = updateKey;
        updateSearchWithResults(destination, region as Region, {
          cheapestPrice: {
            amount: cheapestFlight.price,
            currency: data.currency,
          },
          cheapestOrigin: cheapestFlight.origin,
          resultsCount: data.resultCount,
        });
      }
    }
  }, [data, destination, region, updateSearchWithResults]);

  const handleRetry = () => {
    reset();
    mutate({ destination, region, maxResults, departureDate, returnDate });
  };

  // Calculate statistics
  const stats = data?.results.length
    ? {
        cheapest: Math.min(...data.results.map((r) => r.price)),
        average: data.results.reduce((sum, r) => sum + r.price, 0) / data.results.length,
        mostExpensive: Math.max(...data.results.map((r) => r.price)),
      }
    : null;

  // Group flights by city and count airports
  const cityAirportCounts = data?.results.length
    ? data.results.reduce((acc, offer) => {
        const city = offer.city;
        if (!acc[city]) {
          acc[city] = new Set();
        }
        acc[city].add(offer.origin);
        return acc;
      }, {} as Record<string, Set<string>>)
    : null;

  // Format city airport counts for display
  const cityAirportSummary = cityAirportCounts
    ? Object.entries(cityAirportCounts)
        .map(([city, airports]) => ({
          city,
          airportCount: airports.size,
          airports: Array.from(airports),
        }))
        .sort((a, b) => b.airportCount - a.airportCount || a.city.localeCompare(b.city))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="container py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-in">
          <Button variant="ghost" size="sm" className="mb-4 hover:bg-primary-50" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                Flights to {destination}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                Searching from {region.toLowerCase().replace('_', ' ')}
              </p>
            </div>

            {data && (
              <Badge
                variant={data.status === 'COMPLETED' ? 'success' : data.status === 'PARTIAL' ? 'warning' : 'danger'}
                size="md"
                className="self-start sm:self-auto shadow-sm"
              >
                {data.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 mr-1" />}
                {data.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="space-y-4 animate-in">
            <div className="text-center mb-8 p-8 bg-white rounded-2xl shadow-lg border border-primary-100">
              <div className="relative inline-block mb-4">
                <RefreshCw className="w-12 h-12 text-primary-600 animate-spin" />
                <div className="absolute inset-0 bg-primary-200 opacity-20 rounded-full blur-xl"></div>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Searching for the best flight options...
              </p>
              <p className="text-sm text-gray-500">
                This may take 10-30 seconds
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <FlightCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-2xl mx-auto animate-in">
            <div className="bg-gradient-to-br from-white to-danger-50 rounded-2xl shadow-lg border-2 border-danger-200 p-8 text-center">
              <div className="relative inline-block mb-4">
                <AlertCircle className="w-16 h-16 text-danger-600" />
                <div className="absolute inset-0 bg-danger-200 opacity-20 rounded-full blur-xl"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Search Failed
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {error?.message || 'Unable to search flights. Please try again.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={handleRetry} className="shadow-md">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="shadow-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  New Search
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {data && data.results.length > 0 && (
          <div>
            {/* Results header with statistics and view toggle */}
            <div className="mb-6 p-5 bg-gradient-to-r from-white to-primary-50 rounded-xl shadow-md border border-primary-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Stats section */}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    Found <span className="font-semibold text-primary-600">{data.resultCount}</span> result
                    {data.resultCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    Generated at {new Date(data.generatedAt).toLocaleTimeString()}
                  </p>

                  {stats && (
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center gap-2 bg-success-50 px-3 py-1.5 rounded-lg">
                        <TrendingDown className="w-4 h-4 text-success-600" />
                        <span className="text-xs text-gray-600">Best:</span>
                        <span className="text-sm font-bold text-success-600">
                          {formatPrice(stats.cheapest, data.currency)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <span className="text-xs text-gray-600">Avg:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(stats.average, data.currency)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Cities and airport counts */}
                  {cityAirportSummary && cityAirportSummary.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Departure Cities
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cityAirportSummary.map(({ city, airportCount, airports }) => (
                          <div
                            key={city}
                            className="inline-flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100 transition-colors px-3 py-1.5 rounded-lg border border-primary-200"
                            title={`Airports: ${airports.join(', ')}`}
                          >
                            <span className="text-sm font-medium text-gray-900">{city}</span>
                            <span className="text-xs font-bold text-primary-600">({airportCount})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border-2 border-gray-200 shadow-sm">
                  <button
                    onClick={() => setView('list')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                      ${
                        view === 'list'
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                      ${
                        view === 'map'
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Map className="w-4 h-4" />
                    Map
                  </button>
                </div>
              </div>
            </div>

            {/* Map view */}
            {view === 'map' && (
              <div className="animate-in mb-6">
                <AirportMap flights={data.results} currency={data.currency} />
              </div>
            )}

            {/* List view */}
            {view === 'list' && (
              <div className="space-y-4 animate-in">
                {data.results.map((offer, index) => (
                  <div key={`${offer.origin}-${index}`} className="relative hover:scale-[1.01] transition-transform">
                    <FlightCard offer={offer} currency={data.currency} rank={index + 1} />
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-success-500 to-success-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse">
                        BEST DEAL
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom actions */}
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/')}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Search Again
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {data && data.results.length === 0 && (
          <div className="max-w-2xl mx-auto animate-in">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-gray-200 opacity-20 rounded-full blur-xl"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No Flights Found
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We couldn't find any flights to {destination} from {region.toLowerCase().replace('_', ' ')}.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Try searching from a different region or adjusting your criteria.
              </p>
              <Button variant="primary" onClick={() => navigate('/')} className="shadow-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Try Another Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}