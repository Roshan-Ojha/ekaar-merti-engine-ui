import { cn } from '@/lib/utils';

export interface MarksDisplayProps {
  marksAwarded: number | null;
  totalMarks: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function formatMarks(marksAwarded: number | null, totalMarks: number | null): string {
  if (marksAwarded === null || totalMarks === null) {
    return '—';
  }

  return `${marksAwarded} / ${totalMarks} marks`;
}

export function MarksDisplay({ marksAwarded, totalMarks, className, size = 'md' }: MarksDisplayProps) {
  const label = formatMarks(marksAwarded, totalMarks);

  return (
    <span
      className={cn(
        'text-muted-foreground font-medium tabular-nums',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-2xl font-semibold tracking-tight',
        className
      )}>
      {label}
      <span className="sr-only"> marks</span>
    </span>
  );
}
