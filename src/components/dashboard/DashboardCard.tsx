
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className }: DashboardCardProps) {
  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
