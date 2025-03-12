
import { StatCard } from '@/components/dashboard/StatCard';
import { Box, Shield, ShieldAlert, Search } from 'lucide-react';

interface ContainerScanStatsProps {
  totalImages: number;
  totalVulnerabilities: number;
  totalComplianceIssues: number;
  vulnerabilitiesBySeverity: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
}

export function ContainerScanStats({
  totalImages,
  totalVulnerabilities,
  totalComplianceIssues,
  vulnerabilitiesBySeverity
}: ContainerScanStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Images Scanned"
        value={totalImages}
        description="Total container images analyzed"
        icon={<Box className="h-5 w-5" />}
      />
      
      <StatCard
        title="Total Issues"
        value={totalVulnerabilities + totalComplianceIssues}
        description={`${totalVulnerabilities} vulnerabilities and ${totalComplianceIssues} compliance issues`}
        icon={<ShieldAlert className="h-5 w-5" />}
        variant="critical"
      />
      
      <StatCard
        title="Critical & High"
        value={vulnerabilitiesBySeverity.Critical + vulnerabilitiesBySeverity.High}
        description={`${vulnerabilitiesBySeverity.Critical} critical, ${vulnerabilitiesBySeverity.High} high severity`}
        icon={<Shield className="h-5 w-5" />}
        variant="high"
      />
      
      <StatCard
        title="Medium & Low"
        value={vulnerabilitiesBySeverity.Medium + vulnerabilitiesBySeverity.Low}
        description={`${vulnerabilitiesBySeverity.Medium} medium, ${vulnerabilitiesBySeverity.Low} low severity`}
        icon={<Search className="h-5 w-5" />}
        variant="medium"
      />
    </div>
  );
}
