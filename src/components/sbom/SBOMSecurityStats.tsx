
import { StatCard } from '@/components/dashboard/StatCard';
import { Package, AlertTriangle, ShieldAlert, FileCheck } from 'lucide-react';

interface SBOMSecurityStatsProps {
  totalPackages: number;
  vulnerablePackages: number;
  totalVulnerabilities: number;
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function SBOMSecurityStats({
  totalPackages,
  vulnerablePackages,
  totalVulnerabilities,
  severityCounts
}: SBOMSecurityStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Packages"
        value={totalPackages}
        description={`${vulnerablePackages} packages have vulnerabilities`}
        icon={<Package className="h-5 w-5" />}
      />
      
      <StatCard
        title="Total Vulnerabilities"
        value={totalVulnerabilities}
        description={`Found across ${vulnerablePackages} packages`}
        icon={<AlertTriangle className="h-5 w-5" />}
        variant={totalVulnerabilities > 0 ? "critical" : "default"}
      />
      
      <StatCard
        title="Critical & High"
        value={severityCounts.critical + severityCounts.high}
        description={`${severityCounts.critical} critical, ${severityCounts.high} high severity`}
        icon={<ShieldAlert className="h-5 w-5" />}
        variant={(severityCounts.critical + severityCounts.high) > 0 ? "high" : "default"}
      />
      
      <StatCard
        title="Medium & Low"
        value={severityCounts.medium + severityCounts.low}
        description={`${severityCounts.medium} medium, ${severityCounts.low} low severity`}
        icon={<FileCheck className="h-5 w-5" />}
        variant={severityCounts.medium > 0 ? "medium" : "low"}
      />
    </div>
  );
}
