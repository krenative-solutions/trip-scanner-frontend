import { useState } from 'react';
import { ExternalLink, Plane, Clock, MapPin, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import { formatDuration, formatPrice, formatStops, formatDateTime } from '../../lib/formatters';
import type { FlightOffer } from '../../types';

interface FlightCardProps {
  offer: FlightOffer;
  currency: string;
  rank?: number;
}

/**
 * FlightCard component displays a single flight offer
 * Shows: origin, price, duration, stops, airline, and booking options
 *
 * Improvements over guide:
 * - Added rank number for visual hierarchy
 * - Better mobile responsiveness
 * - Commission type badges
 * - Enhanced visual feedback
 */
export function FlightCard({ offer, currency, rank }: FlightCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showReturnDetails, setShowReturnDetails] = useState(false);
  const hasBookingOptions = offer.bookingOptions && offer.bookingOptions.length > 0;
  const primaryBooking = hasBookingOptions && offer.bookingOptions ? offer.bookingOptions[0] : null;
  const secondaryBookings = hasBookingOptions && offer.bookingOptions ? offer.bookingOptions.slice(1) : [];
  const hasSegments = offer.segments && offer.segments.length > 0;
  const hasLayovers = offer.layovers && offer.layovers.length > 0;
  const hasReturnFlight = offer.returnFlight !== null;
  const hasReturnSegments = hasReturnFlight && offer.returnFlight!.segments.length > 0;
  const hasReturnLayovers = hasReturnFlight && offer.returnFlight!.layovers.length > 0;

  const handleBookingClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-4 sm:p-6 animate-in">
      {/* Rank badge (optional) */}
      {rank !== undefined && (
        <div className="absolute -top-3 -left-3 bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md">
          #{rank}
        </div>
      )}

      {/* Header: Origin City & Price */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {offer.city}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {offer.origin}
            {offer.airlineCode && ` • ${offer.airlineCode}`}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl sm:text-3xl font-bold text-primary-600">
            {formatPrice(offer.price, currency)}
          </div>
          <p className="text-xs text-gray-500">per person</p>
        </div>
      </div>

      {/* Flight Details Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 py-3 border-y">
        {/* Duration */}
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium truncate">
              {formatDuration(offer.durationMinutes)}
            </p>
          </div>
        </div>

        {/* Stops */}
        <div className="flex items-start gap-2">
          <Plane className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Stops</p>
            <p className="text-sm font-medium truncate">
              {formatStops(offer.stops)}
            </p>
            {offer.stops === 0 && (
              <Badge variant="success" size="sm" className="mt-0.5">
                Direct
              </Badge>
            )}
          </div>
        </div>

        {/* Airline */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Airline</p>
            <p className="text-sm font-medium truncate">
              {offer.airline || 'Multiple'}
            </p>
          </div>
        </div>
      </div>

      {/* Outbound Flight times (if available) */}
      {offer.departureTime && offer.arrivalTime && (
        <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-lg border border-primary-200">
          {hasReturnFlight && (
            <p className="text-xs font-bold text-primary-800 uppercase tracking-wide mb-3">Outbound Flight</p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-1">Departure</p>
              <p className="text-sm font-semibold text-gray-900">{formatDateTime(offer.departureTime)}</p>
            </div>
            <div className="hidden sm:flex items-center justify-center px-4">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-primary-300"></div>
                <Plane className="w-5 h-5 text-primary-600 rotate-90" />
                <div className="h-px w-8 bg-primary-300"></div>
              </div>
            </div>
            <div className="flex-1 sm:text-right">
              <p className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-1">Arrival</p>
              <p className="text-sm font-semibold text-gray-900">{formatDateTime(offer.arrivalTime)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Return Flight times (if available) */}
      {hasReturnFlight && offer.returnFlight && (
        <div className="mb-4 p-4 bg-gradient-to-r from-success-50 to-success-100/50 rounded-lg border border-success-200">
          <p className="text-xs font-bold text-success-800 uppercase tracking-wide mb-3">Return Flight</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-success-700 uppercase tracking-wide mb-1">Departure</p>
              <p className="text-sm font-semibold text-gray-900">{formatDateTime(offer.returnFlight.departureTime)}</p>
            </div>
            <div className="hidden sm:flex items-center justify-center px-4">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-success-300"></div>
                <Plane className="w-5 h-5 text-success-600 rotate-90" />
                <div className="h-px w-8 bg-success-300"></div>
              </div>
            </div>
            <div className="flex-1 sm:text-right">
              <p className="text-xs font-medium text-success-700 uppercase tracking-wide mb-1">Arrival</p>
              <p className="text-sm font-semibold text-gray-900">{formatDateTime(offer.returnFlight.arrivalTime)}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-success-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-success-700">Duration:</span> <span className="font-medium text-gray-900">{formatDuration(offer.returnFlight.durationMinutes)}</span>
            </div>
            <div className="text-right">
              <span className="text-success-700">Stops:</span> <span className="font-medium text-gray-900">{formatStops(offer.returnFlight.stops)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking deadline warning */}
      {offer.bookBy && (
        <div className="mb-4 p-2 bg-warning-50 border border-warning-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-warning-700">
            Book by {new Date(offer.bookBy).toLocaleDateString()} for this price
          </p>
        </div>
      )}

      {/* Outbound Flight Details Toggle */}
      {(hasSegments || hasLayovers) && (
        <div className="mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-gray-700">
              {showDetails ? 'Hide' : 'Show'} {hasReturnFlight ? 'Outbound ' : ''}Flight Details
            </span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 space-y-3">
              {/* Flight Segments */}
              {hasSegments && (
                <div className="space-y-3">
                  {offer.segments!.map((segment, index) => (
                    <div key={index}>
                      <div className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-semibold text-gray-900">
                              Flight {segment.flightNumber}
                            </span>
                            <Badge variant="default" size="sm">
                              {segment.airlineCode}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDuration(segment.durationMinutes)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Departs</p>
                            <p className="font-medium text-gray-900">
                              {segment.departure.city === segment.departure.airport
                                ? segment.departure.airport
                                : `${segment.departure.city} (${segment.departure.airport})`}
                            </p>
                            <p className="text-xs text-gray-600">{formatDateTime(segment.departure.time)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Arrives</p>
                            <p className="font-medium text-gray-900">
                              {segment.arrival.city === segment.arrival.airport
                                ? segment.arrival.airport
                                : `${segment.arrival.city} (${segment.arrival.airport})`}
                            </p>
                            <p className="text-xs text-gray-600">{formatDateTime(segment.arrival.time)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Layover after this segment */}
                      {hasLayovers && index < offer.segments!.length - 1 && offer.layovers![index] && (
                        <div className={`p-2 rounded-lg flex items-start gap-2 ${
                          offer.layovers![index].isShort
                            ? 'bg-danger-50 border border-danger-200'
                            : offer.layovers![index].isLong
                            ? 'bg-warning-50 border border-warning-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <Clock className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            offer.layovers![index].isShort
                              ? 'text-danger-600'
                              : offer.layovers![index].isLong
                              ? 'text-warning-600'
                              : 'text-gray-600'
                          }`} />
                          <div className="flex-1">
                            <p className={`text-xs font-medium ${
                              offer.layovers![index].isShort
                                ? 'text-danger-700'
                                : offer.layovers![index].isLong
                                ? 'text-warning-700'
                                : 'text-gray-700'
                            }`}>
                              {offer.layovers![index].city === offer.layovers![index].airport
                                ? `Layover in ${offer.layovers![index].airport}`
                                : `Layover in ${offer.layovers![index].city} (${offer.layovers![index].airport})`}
                            </p>
                            <p className={`text-xs ${
                              offer.layovers![index].isShort
                                ? 'text-danger-600'
                                : offer.layovers![index].isLong
                                ? 'text-warning-600'
                                : 'text-gray-600'
                            }`}>
                              {formatDuration(offer.layovers![index].durationMinutes)} • {offer.layovers![index].description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Return Flight Details Toggle */}
      {hasReturnFlight && (hasReturnSegments || hasReturnLayovers) && (
        <div className="mb-4">
          <button
            onClick={() => setShowReturnDetails(!showReturnDetails)}
            className="w-full p-3 bg-success-50 hover:bg-success-100 rounded-lg transition-colors flex items-center justify-between border border-success-200"
          >
            <span className="text-sm font-semibold text-success-800">
              {showReturnDetails ? 'Hide' : 'Show'} Return Flight Details
            </span>
            {showReturnDetails ? (
              <ChevronUp className="w-4 h-4 text-success-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-success-700" />
            )}
          </button>

          {showReturnDetails && offer.returnFlight && (
            <div className="mt-3 space-y-3">
              {/* Return Flight Segments */}
              {hasReturnSegments && (
                <div className="space-y-3">
                  {offer.returnFlight.segments.map((segment, index) => (
                    <div key={index}>
                      <div className="p-3 bg-white border border-success-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4 text-success-600" />
                            <span className="text-sm font-semibold text-gray-900">
                              Flight {segment.flightNumber}
                            </span>
                            <Badge variant="success" size="sm">
                              {segment.airlineCode}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDuration(segment.durationMinutes)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Departs</p>
                            <p className="font-medium text-gray-900">
                              {segment.departure.city === segment.departure.airport
                                ? segment.departure.airport
                                : `${segment.departure.city} (${segment.departure.airport})`}
                            </p>
                            <p className="text-xs text-gray-600">{formatDateTime(segment.departure.time)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Arrives</p>
                            <p className="font-medium text-gray-900">
                              {segment.arrival.city === segment.arrival.airport
                                ? segment.arrival.airport
                                : `${segment.arrival.city} (${segment.arrival.airport})`}
                            </p>
                            <p className="text-xs text-gray-600">{formatDateTime(segment.arrival.time)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Layover after this segment */}
                      {hasReturnLayovers && offer.returnFlight && index < offer.returnFlight.segments.length - 1 && offer.returnFlight.layovers[index] && (() => {
                        const layover = offer.returnFlight!.layovers[index];
                        return (
                          <div className={`p-2 rounded-lg flex items-start gap-2 ${
                            layover.isShort
                              ? 'bg-danger-50 border border-danger-200'
                              : layover.isLong
                              ? 'bg-warning-50 border border-warning-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <Clock className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              layover.isShort
                                ? 'text-danger-600'
                                : layover.isLong
                                ? 'text-warning-600'
                                : 'text-gray-600'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-xs font-medium ${
                                layover.isShort
                                  ? 'text-danger-700'
                                  : layover.isLong
                                  ? 'text-warning-700'
                                  : 'text-gray-700'
                              }`}>
                                {layover.city === layover.airport
                                  ? `Layover in ${layover.airport}`
                                  : `Layover in ${layover.city} (${layover.airport})`}
                              </p>
                              <p className={`text-xs ${
                                layover.isShort
                                  ? 'text-danger-600'
                                  : layover.isLong
                                  ? 'text-warning-600'
                                  : 'text-gray-600'
                              }`}>
                                {formatDuration(layover.durationMinutes)} • {layover.description}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Booking Options */}
      {hasBookingOptions && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Booking Options
          </p>

          {/* Primary booking option (highest priority) */}
          {primaryBooking && (
            <Button
              variant="primary"
              size="md"
              onClick={() => handleBookingClick(primaryBooking.url)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {primaryBooking.displayLabel}
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}

          {/* Secondary booking options */}
          {secondaryBookings.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {secondaryBookings.map((option) => (
                <Button
                  key={option.provider}
                  variant="outline"
                  size="sm"
                  onClick={() => handleBookingClick(option.url)}
                  className="flex items-center gap-2"
                >
                  {option.displayLabel}
                  <ExternalLink className="w-3 h-3" />
                </Button>
              ))}
            </div>
          )}

          {/* Commission badges */}
          <div className="flex flex-wrap gap-2">
            {offer.bookingOptions &&
              offer.bookingOptions
                .filter((opt) => opt.commissionType === 'AFFILIATE')
                .map((option) => (
                  <Badge key={option.provider} variant="default" size="sm">
                    Affiliate Partner
                  </Badge>
                ))}
          </div>
        </div>
      )}

      {/* No booking options fallback */}
      {!hasBookingOptions && (
        <div className="text-center py-4 text-sm text-gray-500">
          <p>Booking options not available for this flight</p>
        </div>
      )}
    </Card>
  );
}