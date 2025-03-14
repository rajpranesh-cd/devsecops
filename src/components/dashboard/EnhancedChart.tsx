
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summaryStats } from "@/data/sampleData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

interface EnhancedChartProps {
  className?: string;
  style?: React.CSSProperties;
}

export function EnhancedChart({ className, style }: EnhancedChartProps) {
  const timelineData = summaryStats.scanTimeline;

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const totalIssues = payload.reduce((sum, entry) => sum + (entry.value as number), 0);
      
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => {
              const value = entry.value as number;
              const percentage = Math.round((value / totalIssues) * 100);
              
              let colorClass = "";
              switch(entry.name) {
                case "critical": colorClass = "text-severity-critical"; break;
                case "high": colorClass = "text-severity-high"; break;
                case "medium": colorClass = "text-severity-medium"; break;
                case "low": colorClass = "text-severity-low"; break;
              }
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color as string }}
                    />
                    <span className={cn("text-xs capitalize", colorClass)}>
                      {entry.name}:
                    </span>
                  </div>
                  <span className="text-xs font-medium">
                    {value} ({percentage}%)
                  </span>
                </div>
              );
            })}
            <div className="pt-1.5 mt-1.5 border-t flex justify-between">
              <span className="text-xs font-medium">Total:</span>
              <span className="text-xs font-medium">{totalIssues}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className} style={style}>
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center justify-between">
            <span>Vulnerability Trends Over Time</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-severity-critical border-severity-critical/30 bg-severity-critical/5">
                Critical
              </Badge>
              <Badge variant="outline" className="text-severity-high border-severity-high/30 bg-severity-high/5">
                High
              </Badge>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          Security vulnerabilities over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--severity-critical))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--severity-critical))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--severity-high))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--severity-high))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--severity-medium))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--severity-medium))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--severity-low))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--severity-low))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                axisLine={{ strokeWidth: 0 }}
                tickLine={{ strokeWidth: 0 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ strokeWidth: 0 }}
                tickLine={{ strokeWidth: 0 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="critical" 
                name="critical"
                stackId="1"
                stroke="hsl(var(--severity-critical))" 
                fill="url(#colorCritical)" 
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="high" 
                name="high"
                stackId="1"
                stroke="hsl(var(--severity-high))" 
                fill="url(#colorHigh)" 
              />
              <Area 
                type="monotone" 
                dataKey="medium" 
                name="medium"
                stackId="1"
                stroke="hsl(var(--severity-medium))" 
                fill="url(#colorMedium)" 
              />
              <Area 
                type="monotone" 
                dataKey="low" 
                name="low"
                stackId="1"
                stroke="hsl(var(--severity-low))" 
                fill="url(#colorLow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-severity-critical mr-2"></span>
            <span className="text-xs">Critical</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-severity-high mr-2"></span>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-severity-medium mr-2"></span>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-severity-low mr-2"></span>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
