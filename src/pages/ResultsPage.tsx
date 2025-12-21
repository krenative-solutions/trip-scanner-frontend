import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, RefreshCw, TrendingDown } from 'lucide-react';
import { useFlightSearch } from '../hooks/useFlightSearch';
import { FlightCard, FlightCardSkeleton } from '../components/flight';
import { Button, Badge } from '../components/ui';
import { formatPrice } from '../lib/formatters';

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
  const destination = searchParams.get('destination') || '';
  const region = searchParams.get('region') || 'EUROPE';
  const maxResults = Number(searchParams.get('maxResults')) || 10;

  const { mutate, data, isPending, isError, error, reset } = useFlightSearch();

  useEffect(() => {
    if (destination) {
      mutate({ destination, region, maxResults });
    }
  }, [destination, region, maxResults, mutate]);

  const handleRetry = () => {
    reset();
    mutate({ destination, region, maxResults });
  };

  // Calculate statistics
  const stats = data?.results.length
    ? {
        cheapest: Math.min(...data.results.map((r) => r.price)),
        average: data.results.reduce((sum, r) => sum + r.price, 0) / data.results.length,
        mostExpensive: Math.max(...data.results.map((r) => r.price)),
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Flights to {destination}
              </h1>
              <p className="text-gray-600">
                Searching from {region.toLowerCase().replace('_', ' ')}
              </p>
            </div>

            {data && (
              <Badge
                variant={data.status === 'COMPLETED' ? 'success' : data.status === 'PARTIAL' ? 'warning' : 'danger'}
                size="md"
                className="self-start sm:self-auto"
              >
                {data.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 mr-1" />}
                {data.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">
                Searching for the best flight options...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This may take 10-30 seconds
              </p>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <FlightCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-danger-200 p-8 text-center">
              <AlertCircle className="w-16 h-16 text-danger-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Search Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {error?.message || 'Unable to search flights. Please try again.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={handleRetry}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    New Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {data && data.results.length > 0 && (
          <div>
            {/* Results header with statistics */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Found <span className="font-semibold">{data.resultCount}</span> result
                    {data.resultCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    Generated at {new Date(data.generatedAt).toLocaleTimeString()}
                  </p>
                </div>

                {stats && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-success-600" />
                      <span className="text-gray-600">Best price:</span>
                      <span className="font-bold text-success-600">
                        {formatPrice(stats.cheapest, data.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Avg:</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(stats.average, data.currency)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Flight cards */}
            <div className="space-y-4">
              {data.results.map((offer, index) => (
                <div key={`${offer.origin}-${index}`} className="relative">
                  <FlightCard offer={offer} currency={data.currency} rank={index + 1} />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-success-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
                      BEST DEAL
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="mt-8 text-center">
              <Link to="/">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Search Again
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* No Results */}
        {data && data.results.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Flights Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any flights to {destination} from {region.toLowerCase().replace('_', ' ')}.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Try searching from a different region or adjusting your criteria.
              </p>
              <Link to="/">
                <Button variant="primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try Another Search
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}