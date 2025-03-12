
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { sampleSCAResults } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, RefreshCw, Package2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function SCA() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // Flatten all alerts from all repositories
  const allAlerts = sampleSCAResults.flatMap(repo => 
    repo.alerts.map(alert => ({
      ...alert,
      repository: repo.repository
    }))
  );
  
  // Filter alerts based on search query
  const filteredAlerts = allAlerts.filter(alert => 
    alert.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.package.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.advisory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.cve.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  // Functions to filter alerts by severity
  const criticalAlerts = filteredAlerts.filter(alert => alert.severity === 'Critical');
  const highAlerts = filteredAlerts.filter(alert => alert.severity === 'High');
  const mediumAlerts = filteredAlerts.filter(alert => alert.severity === 'Medium');
  
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <Package2 className="h-5 w-5 mr-2 text-severity-medium" />
            <h1 className="text-xl font-semibold">Software Composition Analysis</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleStartScan} disabled={isScanning}>
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan Now
                </>
              )}
            </Button>
          </div>
        </header>
        
        <div className="px-6 py-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories, packages, CVEs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({filteredAlerts.length})</TabsTrigger>
              <TabsTrigger value="critical">Critical ({criticalAlerts.length})</TabsTrigger>
              <TabsTrigger value="high">High ({highAlerts.length})</TabsTrigger>
              <TabsTrigger value="medium">Medium ({mediumAlerts.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <SCAResultsTable alerts={filteredAlerts} />
            </TabsContent>
            
            <TabsContent value="critical">
              <SCAResultsTable alerts={criticalAlerts} />
            </TabsContent>
            
            <TabsContent value="high">
              <SCAResultsTable alerts={highAlerts} />
            </TabsContent>
            
            <TabsContent value="medium">
              <SCAResultsTable alerts={mediumAlerts} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

interface SCAResultsTableProps {
  alerts: Array<{
    repository: string;
    package: string;
    version: string;
    severity: string;
    advisory: string;
    cve: string;
    fixedIn: string;
  }>;
}

function SCAResultsTable({ alerts }: SCAResultsTableProps) {
  return (
    <DashboardCard title={`Dependency Vulnerabilities (${alerts.length})`}>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Repository</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Package</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Version</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Severity</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Advisory</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">CVE</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Fixed In</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} className="border-b hover:bg-muted/40 transition-colors">
                <td className="py-3 px-4 font-medium">{alert.repository}</td>
                <td className="py-3 px-4 font-mono text-xs">{alert.package}</td>
                <td className="py-3 px-4 font-mono text-xs">{alert.version}</td>
                <td className="py-3 px-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    {
                      "bg-severity-critical/10 text-severity-critical": alert.severity === 'Critical',
                      "bg-severity-high/10 text-severity-high": alert.severity === 'High',
                      "bg-severity-medium/10 text-severity-medium": alert.severity === 'Medium',
                      "bg-severity-low/10 text-severity-low": alert.severity === 'Low',
                    }
                  )}>
                    {alert.severity}
                  </span>
                </td>
                <td className="py-3 px-4">{alert.advisory}</td>
                <td className="py-3 px-4 font-mono text-xs">{alert.cve}</td>
                <td className="py-3 px-4 font-mono text-xs">{alert.fixedIn}</td>
              </tr>
            ))}
            
            {alerts.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No vulnerabilities found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
