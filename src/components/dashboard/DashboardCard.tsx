
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  action?: ReactNode; // Added action prop
}

export function DashboardCard({ title, children, className, style, action }: DashboardCardProps) {
  return (
    <div 
      className={cn("bg-card rounded-lg border shadow-sm overflow-hidden animate-in fade-in-50", className)}
      style={style}
    >
      <div className="flex flex-col space-y-1.5 p-6 pb-0">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      </div>
      <div className="p-6 pt-4">{children}</div>
    </div>
  );
}
