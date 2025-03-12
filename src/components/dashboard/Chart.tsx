
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  ComposedChart
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
          <ComposedChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.4} 
              vertical={false}
            />
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
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 8,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)'
              }}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-xs font-medium">{value}</span>
              )}
              wrapperStyle={{
                paddingTop: '8px'
              }}
            />
            {series.map((s) => (
              <>
                <Area
                  key={`area-${s.key}`}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  fill={s.color}
                  stroke={s.color}
                  fillOpacity={0.1}
                />
                <Line
                  key={`line-${s.key}`}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
