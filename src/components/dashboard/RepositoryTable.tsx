
import { AlertTriangle, FileKey, Package2 } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { sampleSecretScanResults, sampleSCAResults } from '@/data/sampleData';
import { cn } from '@/lib/utils';

export function RepositoryTable() {
  // Combine data to show repositories with issues
  const repositories = Array.from(new Set([
    ...sampleSecretScanResults.map(repo => repo.repository),
    ...sampleSCAResults.map(repo => repo.repository)
  ]));

  return (
    <DashboardCard title="Repository Security Overview">
      <div className="overflow-auto max-h-96">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Repository</th>
              <th className="py-3 px-4 text-center font-medium text-muted-foreground">Secrets</th>
              <th className="py-3 px-4 text-center font-medium text-muted-foreground">Vulnerabilities</th>
              <th className="py-3 px-4 text-center font-medium text-muted-foreground">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {repositories.map((repo) => {
              const secretData = sampleSecretScanResults.find(r => r.repository === repo);
              const scaData = sampleSCAResults.find(r => r.repository === repo);
              
              const secretCount = secretData?.findings.length || 0;
              const vulnCount = scaData ? scaData.critical + scaData.high + scaData.medium + scaData.low : 0;
              
              // Calculate risk level
              let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'low';
              if (scaData?.critical > 0 || secretCount > 2) {
                riskLevel = 'critical';
              } else if (scaData?.high > 0 || secretCount > 0) {
                riskLevel = 'high';
              } else if (scaData?.medium > 0) {
                riskLevel = 'medium';
              }

              return (
                <tr key={repo} className="border-b hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4 font-medium">{repo}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <FileKey className="h-4 w-4 text-muted-foreground" />
                      <span>{secretCount}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Package2 className="h-4 w-4 text-muted-foreground" />
                      <span>{vulnCount}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full flex items-center font-medium",
                        {
                          "bg-severity-critical/10 text-severity-critical": riskLevel === 'critical',
                          "bg-severity-high/10 text-severity-high": riskLevel === 'high',
                          "bg-severity-medium/10 text-severity-medium": riskLevel === 'medium',
                          "bg-severity-low/10 text-severity-low": riskLevel === 'low',
                        }
                      )}>
                        <AlertTriangle className="h-3 w-3 mr-1.5" />
                        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
