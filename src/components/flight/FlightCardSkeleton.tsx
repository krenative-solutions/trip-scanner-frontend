import { Card, Skeleton } from '../ui';

/**
 * Loading skeleton for FlightCard
 * Matches the layout of the actual FlightCard component
 */
export function FlightCardSkeleton() {
  return (
    <Card className="p-4 sm:p-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2 text-right">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
      </div>

      {/* Flight details grid skeleton */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 py-3 border-y">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Booking options skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </Card>
  );
}