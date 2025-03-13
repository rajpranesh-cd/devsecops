
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package2, 
  AlertTriangle, 
  GitBranch, 
  ExternalLink 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface SBOMDetailViewProps {
  packageData: {
    name: string;
    version: string;
    license: string;
    vulnerabilities: Array<{
      cve: string;
      severity: string;
      description: string;
    }>;
  };
  onBackClick: () => void;
  getSeverityColor: (severity: string) => string;
}

export function SBOMDetailView({ packageData, onBackClick, getSeverityColor }: SBOMDetailViewProps) {
  return (
    <DashboardCard 
      title={
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 -ml-2"
            onClick={onBackClick}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span>Package Details: {packageData.name}</span>
        </div>
      }
    >
      <div className="mb-4 p-4 bg-muted/40 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <Package2 className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">Package</div>
            <div className="font-medium">{packageData.name}</div>
          </div>
        </div>
        <div className="flex items-center">
          <GitBranch className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">Version</div>
            <div className="font-medium">{packageData.version}</div>
          </div>
        </div>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">License</div>
            <div className="font-medium">
              <Badge variant="outline">{packageData.license}</Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="vulnerabilities">
        <TabsList className="mb-4">
          <TabsTrigger value="vulnerabilities" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Vulnerabilities
            <Badge variant="outline" className="ml-1">
              {packageData.vulnerabilities.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-1">
            <Package2 className="h-4 w-4" />
            Package Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vulnerabilities">
          {packageData.vulnerabilities.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CVE</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packageData.vulnerabilities.map((vuln, index) => (
                    <TableRow key={index}>
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
                      <TableCell>
                        <Badge className={cn('border', getSeverityColor(vuln.severity))}>
                          {vuln.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">{vuln.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <div className="p-4 rounded-full bg-green-500/10 text-green-500 mx-auto mb-4 w-fit">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">No vulnerabilities found</h3>
              <p className="mt-2">This package is free from known vulnerabilities.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="details">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Component Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Package Name:</div>
                <div className="font-mono bg-muted p-2 rounded">{packageData.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Version:</div>
                <div className="font-mono bg-muted p-2 rounded">{packageData.version}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">License:</div>
                <div className="font-mono bg-muted p-2 rounded">{packageData.license}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Checksum (SHA-256):</div>
                <div className="font-mono bg-muted p-2 rounded text-xs truncate">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-4">Dependency Relationships</h3>
            <div className="bg-muted p-3 rounded">
              <div className="text-sm italic text-muted-foreground">
                This package has no direct dependencies or they were not specified in the SBOM.
              </div>
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-4">Build & Compilation Details</h3>
            <div className="bg-muted p-3 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Built By:</span> CI/CD Pipeline</div>
                <div><span className="font-medium">Build Date:</span> 2023-10-15T14:32:00Z</div>
                <div><span className="font-medium">Build Tool:</span> npm v9.5.0</div>
                <div><span className="font-medium">Node Version:</span> v18.12.1</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardCard>
  );
}
