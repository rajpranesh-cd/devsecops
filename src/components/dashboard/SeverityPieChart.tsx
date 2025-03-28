
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SeverityPieChartProps {
  data: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function SeverityPieChart({ data, className, style }: SeverityPieChartProps) {
  const chartData = [
    { name: 'Critical', value: data.critical, color: 'var(--severity-critical)' },
    { name: 'High', value: data.high, color: 'var(--severity-high)' },
    { name: 'Medium', value: data.medium, color: 'var(--severity-medium)' },
    { name: 'Low', value: data.low, color: 'var(--severity-low)' },
  ];

  const totalIssues = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={className} style={style}>
      <div className="h-[300px] relative">
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold">{totalIssues}</span>
          <span className="text-xs text-muted-foreground">Total Issues</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              innerRadius={85}
              paddingAngle={3}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => 
                percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
              }
              className="drop-shadow-sm"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  strokeWidth={2}
                  stroke="var(--background)"
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} Issues (${((value / totalIssues) * 100).toFixed(1)}%)`, 
                name
              ]}
              contentStyle={{ 
                borderRadius: 12,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '12px',
              }}
              itemStyle={{ padding: '4px 0' }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value, entry) => {
                const { payload } = entry as any;
                const percentage = ((payload.value / totalIssues) * 100).toFixed(1);
                return (
                  <span className="text-xs font-medium px-2">
                    {value} ({percentage}%)
                  </span>
                );
              }}
              iconSize={12}
              iconType="circle"
              wrapperStyle={{
                paddingTop: '16px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
