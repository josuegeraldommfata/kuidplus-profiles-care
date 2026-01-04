import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  totalRatings,
  size = 'md',
  showCount = true,
  className,
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

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizes[size], 'fill-warning text-warning')}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizes[size], 'text-muted-foreground/30')} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(sizes[size], 'fill-warning text-warning')} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizes[size], 'text-muted-foreground/30')}
          />
        ))}
      </div>
      {showCount && (
        <span className={cn('text-muted-foreground', textSizes[size])}>
          {rating.toFixed(1)}
          {totalRatings !== undefined && ` (${totalRatings})`}
        </span>
      )}
    </div>
  );
}
