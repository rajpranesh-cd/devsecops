import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart';
import { ContainerScanStats } from '@/components/dashboard/ContainerScanStats';
import { ContainerImageList } from '@/components/dashboard/ContainerImageList';
import { Button } from '@/components/ui/button';
import { Box, RefreshCw, Filter } from 'lucide-react';
import { containerScanResults, containerScanSummary } from '@/data/containerScanData';
import { Input } from '@/components/ui/input';

export default function Container() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample container repository data with issues - with typed severity
  const containerRepoData = [
    {
      repository: "payment-service",
      issues: [
        {
          id: "CVE-2023-1234",
          title: "OS Command Injection in Base Image",
          severity: "Critical" as const,
          location: "/usr/lib/package/vulnerable-component.so",
          references: "https://nvd.nist.gov/vuln/detail/CVE-2023-1234"
        },
        {
          id: "CVE-2023-5678",
          title: "Privilege Escalation Vulnerability",
          severity: "High" as const,
          location: "/etc/security/access.conf",
          references: "https://nvd.nist.gov/vuln/detail/CVE-2023-5678"
        }
      ]
    },
    {
      repository: "auth-service",
      issues: [
        {
          id: "CVE-2023-9012",
          title: "Insecure Default Configuration",
          severity: "Medium" as const,
          location: "/app/config/security.yaml",
          references: "https://nvd.nist.gov/vuln/detail/CVE-2023-9012"
        }
      ]
    },
    {
      repository: "user-service",
      issues: [
        {
          id: "CVE-2023-7890",
          title: "Exposed Sensitive Environment Variables",
          severity: "High" as const,
          location: "Dockerfile:15",
          references: "https://nvd.nist.gov/vuln/detail/CVE-2023-7890"
        },
        {
          id: "CVE-2023-3456",
          title: "Out-of-date Base Image",
          severity: "Medium" as const,
          location: "Dockerfile:1",
          references: "https://nvd.nist.gov/vuln/detail/CVE-2023-3456"
        },
        {
          id: "CVE-2023-2345",
          title: "Root Execution Vulnerability",
          severity: "Low" as const,
          location: "Dockerfile:8",
          references: "https://nvd.nist.gov/vuln/detail/CVE-2023-2345"
        }
      ]
    }
  ];

  // Filter containerRepoData based on search query
  const filteredContainerRepoData = containerRepoData.filter(repo => {
    return searchQuery === '' || 
      repo.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.issues.some(issue => 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
  });

  // Filter containerScanResults based on search query
  const filteredContainerScanResults = containerScanResults.filter(image => {
    return searchQuery === '' || 
      image.image_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.metadata.os.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.image_digest.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <Box className="h-5 w-5 mr-2 text-blue-500" />
            <h1 className="text-xl font-semibold">Container Scanning</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Now
            </Button>
          </div>
        </header>
        
        <div className="px-6 py-4 border-b">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Filter by repository, image, severity..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <ContainerScanStats 
            totalImages={containerScanSummary.totalImages}
            totalVulnerabilities={containerScanSummary.totalVulnerabilities}
            totalComplianceIssues={containerScanSummary.totalComplianceIssues}
            vulnerabilitiesBySeverity={containerScanSummary.vulnerabilitiesBySeverity}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SeverityPieChart 
              data={{
                critical: containerScanSummary.vulnerabilitiesBySeverity.Critical,
                high: containerScanSummary.vulnerabilitiesBySeverity.High,
                medium: containerScanSummary.vulnerabilitiesBySeverity.Medium,
                low: containerScanSummary.vulnerabilitiesBySeverity.Low,
              }}
              style={{
                animationDelay: '0.1s',
              }}
            />
            
            <DashboardCard title="Container Security Best Practices" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Use minimal base images</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with minimal images like Alpine or distroless to reduce the attack surface.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Don't run as root</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a non-root user in your Dockerfile and use the USER directive to switch to it.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Use multi-stage builds</h4>
                    <p className="text-sm text-muted-foreground">
                      Reduce image size and attack surface by using multi-stage builds to exclude build tools.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Sign your images</h4>
                    <p className="text-sm text-muted-foreground">
                      Use Docker Content Trust or Cosign to sign your images and verify their integrity.
                    </p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
          
          <ContainerImageList containerImages={filteredContainerScanResults} />
        </main>
      </div>
    </div>
  );
}
