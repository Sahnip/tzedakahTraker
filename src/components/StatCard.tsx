import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'accent';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  accent: 'bg-accent/10 border-accent/20',
};

const iconStyles = {
  default: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  accent: 'text-accent',
};

export function StatCard({ label, value, icon, variant = 'default', className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 border shadow-card transition-all duration-200 hover:shadow-card-hover",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && (
          <span className={cn("text-lg", iconStyles[variant])}>
            {icon}
          </span>
        )}
      </div>
      <p className="text-xl font-semibold font-display text-foreground">
        {value}
      </p>
    </div>
  );
}
