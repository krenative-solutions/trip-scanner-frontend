import { ArrowRight, ArrowRightLeft } from 'lucide-react';

export type TripType = 'one-way' | 'round-trip';

interface TripTypeToggleProps {
  value: TripType;
  onChange: (type: TripType) => void;
}

export function TripTypeToggle({ value, onChange }: TripTypeToggleProps) {
  return (
    <div className="inline-flex w-full sm:w-auto rounded-lg border-2 border-gray-200 bg-gray-50 p-1">
      <button
        type="button"
        onClick={() => onChange('one-way')}
        className={`
          flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all
          ${
            value === 'one-way'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        <ArrowRight className="w-4 h-4" />
        <span>One-way</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('round-trip')}
        className={`
          flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all
          ${
            value === 'round-trip'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        <ArrowRightLeft className="w-4 h-4" />
        <span>Round-trip</span>
      </button>
    </div>
  );
}