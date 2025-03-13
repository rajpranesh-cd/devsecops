
import { StatCard } from '@/components/dashboard/StatCard';
import { Code2, AlertTriangle, ShieldAlert, FileCheck } from 'lucide-react';

interface SastSecurityStatsProps {
  totalIssues: number;
  severityCounts: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
}

export function SastSecurityStats({
  totalIssues,
  severityCounts
}: SastSecurityStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Issues"
        value={totalIssues}
        description="Security issues found in codebase"
        icon={<Code2 className="h-5 w-5" />}
        variant={totalIssues > 0 ? "critical" : "default"}
      />
      
      <StatCard
        title="Critical Issues"
        value={severityCounts.Critical}
        description="Critical security vulnerabilities"
        icon={<AlertTriangle className="h-5 w-5" />}
        variant={severityCounts.Critical > 0 ? "critical" : "default"}
      />
      
      <StatCard
        title="High Risk"
        value={severityCounts.High}
        description="High severity issues"
        icon={<ShieldAlert className="h-5 w-5" />}
        variant={severityCounts.High > 0 ? "high" : "default"}
      />
      
      <StatCard
        title="Medium & Low"
        value={severityCounts.Medium + severityCounts.Low}
        description={`${severityCounts.Medium} medium, ${severityCounts.Low} low severity`}
        icon={<FileCheck className="h-5 w-5" />}
        variant={severityCounts.Medium > 0 ? "medium" : "low"}
      />
    </div>
  );
}
