
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DashboardCard } from './DashboardCard';

interface SeverityPieChartProps {
  data: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  className?: string;
}

export function SeverityPieChart({ data, className }: SeverityPieChartProps) {
  const chartData = [
    { name: 'Critical', value: data.critical, color: 'hsl(var(--severity-critical))' },
    { name: 'High', value: data.high, color: 'hsl(var(--severity-high))' },
    { name: 'Medium', value: data.medium, color: 'hsl(var(--severity-medium))' },
    { name: 'Low', value: data.low, color: 'hsl(var(--severity-low))' },
  ];

  return (
    <DashboardCard title="Vulnerabilities by Severity" className={className}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => 
                percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
              }
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  strokeWidth={1}
                  stroke="hsl(var(--background))"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} Issues`, 
                name
              ]}
              contentStyle={{ 
                borderRadius: 8,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => (
                <span className="text-xs font-medium">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
