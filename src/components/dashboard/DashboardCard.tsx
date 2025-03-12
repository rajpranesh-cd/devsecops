
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className }: DashboardCardProps) {
  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden animate-scale-in",
      className
    )}>
      <div className="px-5 py-4 bg-muted/50 border-b">
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
