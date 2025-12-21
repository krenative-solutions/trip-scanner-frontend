import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular';
}

/**
 * Skeleton loader component for loading states
 * Provides visual feedback while content is loading
 *
 * @example
 * <Skeleton className="h-8 w-32" />
 * <Skeleton variant="circular" className="h-12 w-12" />
 */
export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        {
          'rounded-md': variant === 'default',
          'rounded': variant === 'text',
          'rounded-full': variant === 'circular',
        },
        className
      )}
      {...props}
    />
  );
}