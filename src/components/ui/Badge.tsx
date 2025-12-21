import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

/**
 * Badge component for labels and status indicators
 *
 * @example
 * <Badge variant="success">Completed</Badge>
 */
export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-success-50 text-success-700 ring-1 ring-success-600/20': variant === 'success',
          'bg-warning-50 text-warning-700 ring-1 ring-warning-600/20': variant === 'warning',
          'bg-danger-50 text-danger-700 ring-1 ring-danger-600/20': variant === 'danger',
          'bg-primary-50 text-primary-700 ring-1 ring-primary-600/20': variant === 'info',
        },
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-0.5 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    />
  );
}