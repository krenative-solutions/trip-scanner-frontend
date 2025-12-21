import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  clickable?: boolean;
}

/**
 * Card component for content containers
 * Supports hover effects and click interactions
 *
 * @example
 * <Card hoverable>
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = true, clickable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border bg-white shadow-sm transition-all duration-200',
          {
            'hover:shadow-md': hoverable,
            'cursor-pointer hover:scale-[1.01] active:scale-[0.99]': clickable,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';