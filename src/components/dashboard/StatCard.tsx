
import { cn } from '@/lib/utils';

type StatVariant = 'default' | 'critical' | 'high' | 'medium' | 'low';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  variant?: StatVariant;
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  variant = 'default',
  className,
  style
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground border rounded-xl shadow-sm p-6 transition-all hover:shadow-md",
        {
          "border-severity-critical/40 hover:border-severity-critical/60": variant === 'critical',
          "border-severity-high/40 hover:border-severity-high/60": variant === 'high',
          "border-severity-medium/40 hover:border-severity-medium/60": variant === 'medium',
          "border-severity-low/40 hover:border-severity-low/60": variant === 'low',
        },
        className
      )}
      style={style}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className={cn(
            "text-3xl font-bold",
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
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "rounded-full p-3",
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
