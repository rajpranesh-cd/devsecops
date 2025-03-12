
import { cn } from '@/lib/utils';

type StatVariant = 'default' | 'critical' | 'high' | 'medium' | 'low';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  variant?: StatVariant;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      "bg-card text-card-foreground border rounded-xl shadow-sm p-6 animate-scale-in",
      {
        "border-severity-critical/40": variant === 'critical',
        "border-severity-high/40": variant === 'high',
        "border-severity-medium/40": variant === 'medium',
        "border-severity-low/40": variant === 'low',
      },
      className
    )}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className={cn(
            "text-2xl font-semibold",
            {
              "text-severity-critical": variant === 'critical',
              "text-severity-high": variant === 'high',
              "text-severity-medium": variant === 'medium',
              "text-severity-low": variant === 'low',
            }
          )}>
            {value}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "rounded-full p-2",
            {
              "bg-severity-critical/10 text-severity-critical": variant === 'critical',
              "bg-severity-high/10 text-severity-high": variant === 'high',
              "bg-severity-medium/10 text-severity-medium": variant === 'medium',
              "bg-severity-low/10 text-severity-low": variant === 'low',
              "bg-muted text-muted-foreground": variant === 'default',
            }
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
