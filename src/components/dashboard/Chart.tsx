
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
  ComposedChart,
  ReferenceLine
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
  style?: React.CSSProperties;
}

export function Chart({ data, title, xKey, series, className, style }: ChartProps) {
  // Find the max value across all series to add a reference line
  const maxValue = Math.max(
    ...data.flatMap(item => series.map(s => item[s.key] || 0))
  );

  return (
    <DashboardCard title={title} className={cn(className)} style={style}>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 15,
              right: 30,
              left: 20,
              bottom: 15,
            }}
          >
            <defs>
              {series.map((s) => (
                <linearGradient key={`gradient-${s.key}`} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="5 8" 
              stroke="hsl(var(--border))" 
              opacity={0.25} 
              vertical={false}
              horizontal={true}
            />
            <XAxis 
              dataKey={xKey} 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={40}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ReferenceLine 
              y={maxValue} 
              stroke="hsl(var(--border))" 
              strokeDasharray="3 3" 
              isFront={false}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 12,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '12px',
              }}
              itemStyle={{ padding: '4px 0' }}
              formatter={(value: number) => [value.toLocaleString(), '']}
              labelFormatter={(label) => (
                <span className="font-semibold text-sm block border-b pb-2 mb-2">
                  {label}
                </span>
              )}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-xs font-medium px-2">{value}</span>
              )}
              iconSize={12}
              iconType="circle"
              wrapperStyle={{
                paddingTop: '16px'
              }}
            />
            {series.map((s, index) => (
              <>
                <Area
                  key={`area-${s.key}`}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  fill={`url(#gradient-${s.key})`}
                  stroke={s.color}
                  fillOpacity={0.8}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  animationBegin={index * 200}
                />
                <Line
                  key={`line-${s.key}`}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2.5}
                  dot={{ 
                    r: 4, 
                    strokeWidth: 2,
                    fill: 'hsl(var(--background))'
                  }}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 2,
                    fill: 'hsl(var(--background))'
                  }}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  animationBegin={index * 300}
                />
              </>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
