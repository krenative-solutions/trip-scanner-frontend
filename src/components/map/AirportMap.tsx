import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { FlightOffer } from '../../types';
import { getAirportByCode } from '../../data/airports';
import { formatPrice, formatDuration, formatStops } from '../../lib/formatters';
import { Plane } from 'lucide-react';

interface AirportMapProps {
  flights: FlightOffer[];
  currency: string;
  onMarkerClick?: (flight: FlightOffer) => void;
}

/**
 * Component to auto-fit map bounds to show all markers
 */
function MapBounds({ flights }: { flights: FlightOffer[] }) {
  const map = useMap();

  useEffect(() => {
    const validCoords = flights
      .filter(f => f.coordinates !== null)
      .map(f => [f.coordinates!.latitude, f.coordinates!.longitude] as [number, number]);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [flights, map]);

  return null;
}

/**
 * AirportMap - Display departure airports on a map with price markers
 */
export function AirportMap({ flights, currency, onMarkerClick }: AirportMapProps) {
  // Filter flights to only those with coordinates and collect missing ones
  const { validFlights, missingAirports } = useMemo(() => {
    const valid: FlightOffer[] = [];
    const missing: string[] = [];

    flights.forEach(f => {
      if (f.coordinates !== null) {
        valid.push(f);
      } else {
        if (!missing.includes(f.origin)) {
          missing.push(f.origin);
        }
        console.warn(`Missing coordinates for airport: ${f.origin}`);
      }
    });

    console.log(`Map showing ${valid.length} of ${flights.length} flights. Missing: ${missing.join(', ') || 'none'}`);
    return { validFlights: valid, missingAirports: missing };
  }, [flights]);

  const missingCount = flights.length - validFlights.length;

  // Create custom icons for markers based on price rank
  const createPriceIcon = (price: number, rank: number, isCheapest: boolean) => {
    const color = isCheapest ? '#22c55e' : rank <= 3 ? '#0ea5e9' : '#6b7280';
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div class="relative">
          <div style="
            background-color: ${color};
            color: white;
            padding: 6px 10px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            white-space: nowrap;
            border: 2px solid white;
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            ${formattedPrice}
          </div>
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid ${color};
          "></div>
        </div>
      `,
      iconSize: [80, 36],
      iconAnchor: [40, 36],
      popupAnchor: [0, -36],
    });
  };

  if (validFlights.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <Plane className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Map not available</p>
          <p className="text-sm text-gray-500">
            No coordinate data for these airports
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {flights.length} flight(s) missing location data
          </p>
        </div>
      </div>
    );
  }

  // Get center point (first valid flight)
  const centerCoords = validFlights[0].coordinates!;

  return (
    <div>
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <MapContainer
          center={[centerCoords.latitude, centerCoords.longitude]}
          zoom={4}
          style={{ height: '500px', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBounds flights={validFlights} />

          {validFlights.map((flight, index) => {
            const coords = flight.coordinates!;
            const airport = getAirportByCode(flight.origin);
            const isCheapest = index === 0;

            return (
              <Marker
                key={`${flight.origin}-${index}`}
                position={[coords.latitude, coords.longitude]}
                icon={createPriceIcon(flight.price, index + 1, isCheapest)}
                eventHandlers={{
                  click: () => onMarkerClick?.(flight),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-lg text-primary-600">
                          {flight.origin}
                        </div>
                        {airport && (
                          <div className="text-sm text-gray-600">
                            {airport.city}, {airport.country}
                          </div>
                        )}
                      </div>
                      {isCheapest && (
                        <span className="ml-2 px-2 py-0.5 bg-success-500 text-white text-xs font-bold rounded">
                          BEST
                        </span>
                      )}
                    </div>

                    <div className="border-t pt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-bold text-success-600">
                          {formatPrice(flight.price, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm font-medium">
                          {formatDuration(flight.durationMinutes)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stops:</span>
                        <span className="text-sm font-medium">
                          {formatStops(flight.stops)}
                        </span>
                      </div>
                      {flight.airline && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Airline:</span>
                          <span className="text-sm font-medium">
                            {flight.airline}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Show info if some flights are missing from map */}
      {missingCount > 0 && (
        <div className="mt-3 px-4 py-2 bg-warning-50 border border-warning-200 rounded-lg">
          <p className="text-sm text-warning-800">
            <span className="font-semibold">Note:</span> Showing {validFlights.length} of {flights.length} flights on map.
            {' '}{missingAirports.length} airport{missingAirports.length > 1 ? 's' : ''} missing location data: {missingAirports.join(', ')}.
          </p>
          <p className="text-xs text-warning-700 mt-1">
            Switch to list view to see all results.
          </p>
        </div>
      )}
    </div>
  );
}
