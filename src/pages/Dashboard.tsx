
import { AlertTriangle, ShieldAlert, ShieldCheck, FileSearch } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart';
import { RepositoryTable } from '@/components/dashboard/RepositoryTable';
import { EnhancedChart } from '@/components/dashboard/EnhancedChart';
import { summaryStats } from '@/data/sampleData';

export default function Dashboard() {
  const timelineData = summaryStats.scanTimeline;
  const totalFindings = summaryStats.totalFindings;

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-bold">Security Dashboard</h1>
        </header>
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Repositories Scanned"
              value={summaryStats.repositoriesScanned}
              icon={<FileSearch className="h-5 w-5" />}
              description="Last scan: 2 hours ago"
              className="animate-slide-up"
              style={{ animationDelay: '0ms' }}
            />
            <StatCard
              title="Critical Issues"
              value={summaryStats.totalFindings.critical}
              variant="critical"
              icon={<ShieldAlert className="h-5 w-5" />}
              description="Across all repositories"
              className="animate-slide-up"
              style={{ animationDelay: '100ms' }}
            />
            <StatCard
              title="High Issues"
              value={summaryStats.totalFindings.high}
              variant="high"
              icon={<AlertTriangle className="h-5 w-5" />}
              description="Across all repositories"
              className="animate-slide-up"
              style={{ animationDelay: '200ms' }}
            />
            <StatCard
              title="Medium & Low Issues"
              value={summaryStats.totalFindings.medium + summaryStats.totalFindings.low}
              variant="medium"
              icon={<ShieldCheck className="h-5 w-5" />}
              description="Across all repositories"
              className="animate-slide-up"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <SeverityPieChart 
              data={summaryStats.totalFindings} 
              className="lg:col-span-5 animate-fade-in"
              style={{ animationDelay: '400ms' }}
            />
            <EnhancedChart 
              className="lg:col-span-7 animate-fade-in"
              style={{ animationDelay: '500ms' }}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            <RepositoryTable />
          </div>
        </main>
      </div>
    </div>
  );
}
