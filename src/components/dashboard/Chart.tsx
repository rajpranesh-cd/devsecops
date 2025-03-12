
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { DashboardCard } from './DashboardCard';
import { cn } from '@/lib/utils';

interface ChartProps {
  data: Array<Record<string, any>>;
  title: string;
  xKey: string;
  series: Array<{
    name: string;
    key: string;
    color: string;
  }>;
  className?: string;
}

export function Chart({ data, title, xKey, series, className }: ChartProps) {
  return (
    <DashboardCard title={title} className={cn(className)}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis 
              dataKey={xKey} 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }} 
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 8,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)'
              }}
            />
            <Legend 
              formatter={(value, entry) => (
                <span className="text-xs">{value}</span>
              )}
            />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
