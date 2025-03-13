
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, Download, RefreshCw, ExternalLink, ArrowUpRight, Building2, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sastResults, sastSummary, SastVulnerability } from '@/data/sastData';
import { SastSecurityStats } from '@/components/sast/SastSecurityStats';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SAST() {
  const [selectedVulnerability, setSelectedVulnerability] = useState<SastVulnerability | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-severity-critical bg-severity-critical/10 border-severity-critical/20';
      case 'High':
        return 'text-severity-high bg-severity-high/10 border-severity-high/20';
      case 'Medium':
        return 'text-severity-medium bg-severity-medium/10 border-severity-medium/20';
      case 'Low':
        return 'text-severity-low bg-severity-low/10 border-severity-low/20';
      default:
        return 'text-muted-foreground bg-muted/50 border-muted/20';
    }
  };

  // Get unique repositories
  const repositories = Array.from(new Set(sastResults.map(vuln => vuln.repository)));

  // Filter vulnerabilities based on active tab
  const filteredVulnerabilities = activeTab === 'all' 
    ? sastResults 
    : sastResults.filter(vuln => vuln.repository === activeTab);

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <Code2 className="h-5 w-5 mr-2 text-blue-500" />
            <h1 className="text-xl font-semibold">Static Application Security Testing</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Start New Scan
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <SastSecurityStats 
            totalIssues={sastSummary.totalIssues}
            severityCounts={sastSummary.severityCounts}
          />
          
          <DashboardCard title="SAST Scan Results">
            {selectedVulnerability ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedVulnerability(null)}
                    className="-ml-2"
                  >
                    ← Back to Results
                  </Button>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 mr-1" />
                      {selectedVulnerability.repository}
                    </Badge>
                    <Badge className={cn('border', getSeverityColor(selectedVulnerability.severity))}>
                      {selectedVulnerability.severity}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{selectedVulnerability.id}</h3>
                      <span className="text-muted-foreground">-</span>
                      <h3 className="text-lg">{selectedVulnerability.issueTitle}</h3>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {selectedVulnerability.description}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">File Location:</span>
                      <span className="font-mono">{selectedVulnerability.location.file}:{selectedVulnerability.location.line}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Vulnerable Code</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto">
                      <code className="text-sm">{selectedVulnerability.codeSnippet}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">References</h4>
                    <div className="flex space-x-4">
                      <a 
                        href={`https://cwe.mitre.org/data/definitions/${selectedVulnerability.cwe.split('-')[1]}.html`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-700"
                      >
                        {selectedVulnerability.cwe}
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </a>
                      <a 
                        href={selectedVulnerability.owasp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-700"
                      >
                        OWASP Reference
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Remediation</h4>
                    <p className="text-muted-foreground">
                      {selectedVulnerability.remediation}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList>
                    <TabsTrigger value="all" className="flex items-center gap-1">
                      <Code2 className="h-4 w-4" />
                      All Issues
                    </TabsTrigger>
                    {repositories.map(repo => (
                      <TabsTrigger 
                        key={repo} 
                        value={repo} 
                        className="flex items-center gap-1"
                      >
                        <Building2 className="h-4 w-4" />
                        {repo}
                        <Badge variant="outline" className="ml-1 rounded-full py-0 px-1.5 text-xs">
                          {sastResults.filter(v => v.repository === repo).length}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Repository</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>References</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVulnerabilities.map((vuln) => (
                      <TableRow 
                        key={vuln.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedVulnerability(vuln)}
                      >
                        <TableCell className="font-medium">{vuln.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {vuln.repository}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">{vuln.issueTitle}</TableCell>
                        <TableCell>
                          <Badge className={cn('border', getSeverityColor(vuln.severity))}>
                            {vuln.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {vuln.location.file}:{vuln.location.line}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <a 
                              href={`https://cwe.mitre.org/data/definitions/${vuln.cwe.split('-')[1]}.html`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <a 
                              href={vuln.owasp}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </DashboardCard>
        </main>
      </div>
    </div>
  );
}
