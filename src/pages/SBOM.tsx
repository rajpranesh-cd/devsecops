import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  ExternalLink, 
  Package, 
  Shield, 
  GitPullRequest 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleSBOMData } from '@/data/sampleData';
import { SBOMSecurityStats } from '@/components/sbom/SBOMSecurityStats';
import { SBOMDetailView } from '@/components/sbom/SBOMDetailView';
import { cn } from '@/lib/utils';

export default function SBOM() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('packages');

  // Calculate statistics for SBOM data
  const totalPackages = sampleSBOMData.packages.length;
  const vulnerablePackages = sampleSBOMData.packages.filter(pkg => pkg.vulnerabilities.length > 0).length;
  const totalVulnerabilities = sampleSBOMData.packages.reduce(
    (sum, pkg) => sum + pkg.vulnerabilities.length, 0
  );
  
  // Count vulnerabilities by severity
  const severityCounts = sampleSBOMData.packages.reduce((counts, pkg) => {
    pkg.vulnerabilities.forEach(vuln => {
      counts[vuln.severity.toLowerCase()] = (counts[vuln.severity.toLowerCase()] || 0) + 1;
    });
    return counts;
  }, { critical: 0, high: 0, medium: 0, low: 0 });
  
  // Count licenses
  const licenseTypes = sampleSBOMData.packages.reduce((types, pkg) => {
    types[pkg.license] = (types[pkg.license] || 0) + 1;
    return types;
  }, {});

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleBackClick = () => {
    setSelectedPackage(null);
  };

  const getSeverityColor = (severity) => {
    const sev = severity.toLowerCase();
    switch (sev) {
      case 'critical':
        return 'text-severity-critical bg-severity-critical/10 border-severity-critical/20';
      case 'high':
        return 'text-severity-high bg-severity-high/10 border-severity-high/20';
      case 'medium':
        return 'text-severity-medium bg-severity-medium/10 border-severity-medium/20';
      case 'low':
        return 'text-severity-low bg-severity-low/10 border-severity-low/20';
      default:
        return 'text-muted-foreground bg-muted/50 border-muted/20';
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            <h1 className="text-xl font-semibold">Software Bill of Materials</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export SBOM
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate SBOM
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {!selectedPackage ? (
            <>
              <SBOMSecurityStats 
                totalPackages={totalPackages}
                vulnerablePackages={vulnerablePackages}
                totalVulnerabilities={totalVulnerabilities}
                severityCounts={severityCounts}
              />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList>
                  <TabsTrigger value="packages" className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    Packages
                  </TabsTrigger>
                  <TabsTrigger value="vulnerabilities" className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Vulnerabilities
                  </TabsTrigger>
                  <TabsTrigger value="licenses" className="flex items-center gap-1">
                    <GitPullRequest className="h-4 w-4" />
                    Licenses
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="packages">
                  <DashboardCard title="Package Inventory">
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Package Name</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>License</TableHead>
                            <TableHead>Vulnerabilities</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sampleSBOMData.packages.map((pkg, index) => (
                            <TableRow key={index} className={pkg.vulnerabilities.length > 0 ? "bg-severity-critical/5" : ""}>
                              <TableCell>
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto font-medium text-left justify-start"
                                  onClick={() => handlePackageClick(pkg)}
                                >
                                  {pkg.name}
                                </Button>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{pkg.version}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{pkg.license}</Badge>
                              </TableCell>
                              <TableCell>
                                {pkg.vulnerabilities.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {pkg.vulnerabilities.map((vuln, i) => (
                                      <Badge key={i} className={cn('border', getSeverityColor(vuln.severity))}>
                                        {vuln.severity}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    No issues
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DashboardCard>
                </TabsContent>
                
                <TabsContent value="vulnerabilities">
                  <DashboardCard title="Vulnerabilities">
                    {totalVulnerabilities > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>CVE</TableHead>
                              <TableHead>Package</TableHead>
                              <TableHead>Version</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Fixed In</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sampleSBOMData.packages.flatMap(pkg => 
                              pkg.vulnerabilities.map((vuln, i) => (
                                <TableRow key={`${pkg.name}-${i}`}>
                                  <TableCell className="font-mono">
                                    <a 
                                      href={`https://nvd.nist.gov/vuln/detail/${vuln.cve}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center hover:underline text-blue-600"
                                    >
                                      {vuln.cve}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </TableCell>
                                  <TableCell>{pkg.name}</TableCell>
                                  <TableCell>{pkg.version}</TableCell>
                                  <TableCell>
                                    <Badge className={cn('border', getSeverityColor(vuln.severity))}>
                                      {vuln.severity}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="max-w-md">{vuln.description}</TableCell>
                                  <TableCell>N/A</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 text-green-500/60" />
                        <h3 className="text-lg font-medium">No vulnerabilities found</h3>
                        <p className="mt-2">All packages in this SBOM are free from known vulnerabilities.</p>
                      </div>
                    )}
                  </DashboardCard>
                </TabsContent>
                
                <TabsContent value="licenses">
                  <DashboardCard title="License Distribution">
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>License</TableHead>
                            <TableHead>Count</TableHead>
                            <TableHead>Packages</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(licenseTypes).map(([license, count], index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Badge variant="outline">{license}</Badge>
                              </TableCell>
                              <TableCell>{count as React.ReactNode}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {sampleSBOMData.packages
                                    .filter(pkg => pkg.license === license)
                                    .map((pkg, i) => (
                                      <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => handlePackageClick(pkg)}>
                                        {pkg.name}
                                      </Badge>
                                    ))
                                  }
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DashboardCard>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <SBOMDetailView 
              packageData={selectedPackage} 
              onBackClick={handleBackClick} 
              getSeverityColor={getSeverityColor}
            />
          )}
        </main>
      </div>
    </div>
  );
}
