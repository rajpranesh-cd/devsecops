
import { AlertTriangle, ShieldAlert, ShieldCheck, Package2, FileSearch } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart';
import { RepositoryTable } from '@/components/dashboard/RepositoryTable';
import { Chart } from '@/components/dashboard/Chart';
import { summaryStats } from '@/data/sampleData';

export default function Dashboard() {
  const timelineData = summaryStats.scanTimeline;

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">Security Dashboard</h1>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Repositories Scanned"
              value={summaryStats.repositoriesScanned}
              icon={<FileSearch className="h-4 w-4" />}
              description="Last scan: 2 hours ago"
            />
            <StatCard
              title="Critical Issues"
              value={summaryStats.totalFindings.critical}
              variant="critical"
              icon={<ShieldAlert className="h-4 w-4" />}
              description="Across all repositories"
            />
            <StatCard
              title="High Issues"
              value={summaryStats.totalFindings.high}
              variant="high"
              icon={<AlertTriangle className="h-4 w-4" />}
              description="Across all repositories"
            />
            <StatCard
              title="Medium & Low Issues"
              value={summaryStats.totalFindings.medium + summaryStats.totalFindings.low}
              variant="medium"
              icon={<ShieldCheck className="h-4 w-4" />}
              description="Across all repositories"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SeverityPieChart 
              data={summaryStats.totalFindings} 
              className="lg:col-span-1"
            />
            <Chart 
              title="Vulnerability Trends Over Time"
              data={timelineData}
              xKey="date"
              series={[
                { name: 'Critical', key: 'critical', color: 'hsl(var(--severity-critical))' },
                { name: 'High', key: 'high', color: 'hsl(var(--severity-high))' },
                { name: 'Medium', key: 'medium', color: 'hsl(var(--severity-medium))' },
                { name: 'Low', key: 'low', color: 'hsl(var(--severity-low))' },
              ]}
              className="lg:col-span-2"
            />
          </div>

          <div className="mb-6">
            <RepositoryTable />
          </div>
        </main>
      </div>
    </div>
  );
}
