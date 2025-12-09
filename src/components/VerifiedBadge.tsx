import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function VerifiedBadge({ className, size = 'md', showText = true }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Badge
      className={cn(
        'bg-green-500 hover:bg-green-600 text-white flex items-center gap-1',
        sizeClasses[size],
        className
      )}
    >
      <CheckCircle className={iconSizes[size]} />
      {showText && <span>Verified</span>}
    </Badge>
  );
}

export default VerifiedBadge;
