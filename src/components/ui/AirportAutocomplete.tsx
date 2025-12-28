import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchAirports, getAirportByCode, type Airport } from '../../data/airports';

interface AirportAutocompleteProps {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export function AirportAutocomplete({
  value,
  onChange,
  placeholder = 'e.g., BKK, Bangkok, London',
  required = false,
  autoFocus = false,
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (query: string) => {
    const uppercaseQuery = query.toUpperCase();
    setInputValue(uppercaseQuery);

    if (query.length >= 2) {
      const searchResults = searchAirports(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const selectAirport = (airport: Airport) => {
    onChange(airport.code);
    setInputValue(airport.code);
    setIsOpen(false);
    setResults([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          selectAirport(results[selectedIndex]);
        } else if (results[0]) {
          selectAirport(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);

      // Validate and set the input to a valid airport code
      if (inputValue.length === 3) {
        const airport = getAirportByCode(inputValue);
        if (airport) {
          onChange(airport.code);
        } else {
          onChange(inputValue);
        }
      } else if (inputValue.length > 0) {
        // If user typed something but didn't select, try to find a match
        const firstMatch = results[0];
        if (firstMatch) {
          onChange(firstMatch.code);
          setInputValue(firstMatch.code);
        } else {
          onChange(inputValue);
        }
      }
    }, 200);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <strong key={index} className="font-semibold text-primary-700">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const selectedAirport = getAirportByCode(value);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (inputValue.length >= 2) {
              const searchResults = searchAirports(inputValue);
              setResults(searchResults);
              setIsOpen(searchResults.length > 0);
            }
          }}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-3 text-lg border-2 border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     transition-colors uppercase"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Selected airport display */}
      {selectedAirport && inputValue === value && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>
            {selectedAirport.name}, {selectedAirport.city}, {selectedAirport.country}
          </span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {results.map((airport, index) => (
            <button
              key={airport.code}
              type="button"
              onClick={() => selectAirport(airport)}
              className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors
                         ${index === selectedIndex ? 'bg-primary-100' : ''}
                         ${index > 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 text-center">
                  <span className="text-base font-bold text-primary-600">
                    {airport.code}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {highlightMatch(airport.name, inputValue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {highlightMatch(airport.city, inputValue)}, {highlightMatch(airport.country, inputValue)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Help text */}
      <p className="mt-2 text-xs text-gray-500">
        Type city name, airport name, or IATA code • Examples: Bangkok, Heathrow, BKK
      </p>
    </div>
  );
}