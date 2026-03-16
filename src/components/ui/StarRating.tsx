import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  totalRatings,
  size = 'md',
  showCount = true,
  className,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // sanitize rating to a finite number between 0 and 5
  const safeRating = typeof rating === 'number' && Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  const handleClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = !isFilled && i === fullStars && hasHalfStar;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(i)}
              className={cn(interactive && 'cursor-pointer hover:scale-110 transition-transform', !interactive && 'cursor-default')}
            >
              {isFilled ? (
                <Star className={cn(sizes[size], 'fill-warning text-warning')} />
              ) : isHalf ? (
                <div className="relative">
                  <Star className={cn(sizes[size], 'text-muted-foreground/30')} />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className={cn(sizes[size], 'fill-warning text-warning')} />
                  </div>
                </div>
              ) : (
                <Star className={cn(sizes[size], 'text-muted-foreground/30')} />
              )}
            </button>
          );
        })}
      </div>
      {showCount && (
        <span className={cn('text-muted-foreground', textSizes[size])}>
          {safeRating.toFixed(1)}
          {totalRatings !== undefined && ` (${totalRatings})`}
        </span>
      )}
    </div>
  );
}
