
import { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, ExternalLink, Info, Server } from 'lucide-react';
import { ContainerScanResult, Vulnerability, ComplianceIssue } from '@/data/containerScanData';
import { cn } from '@/lib/utils';

interface ContainerImageListProps {
  containerImages: ContainerScanResult[];
}

export function ContainerImageList({ containerImages }: ContainerImageListProps) {
  const [selectedImage, setSelectedImage] = useState<ContainerScanResult | null>(null);

  const handleImageClick = (image: ContainerScanResult) => {
    setSelectedImage(image);
  };

  const handleBackClick = () => {
    setSelectedImage(null);
  };

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

  if (selectedImage) {
    return (
      <DashboardCard 
        title={
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 -ml-2"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span>{selectedImage.image_name}</span>
          </div>
        }
      >
        <div className="mb-4 p-4 bg-muted/40 rounded-lg border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center">
            <Server className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">OS</div>
              <div className="font-medium">{selectedImage.metadata.os}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Size</div>
              <div className="font-medium">{selectedImage.metadata.size}</div>
            </div>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Created By</div>
              <div className="font-medium truncate max-w-[200px]">{selectedImage.metadata.created_by}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Scan Date</div>
              <div className="font-medium">{new Date(selectedImage.scan_date).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="vulnerabilities">
          <TabsList className="mb-4">
            <TabsTrigger value="vulnerabilities" className="flex gap-2">
              Vulnerabilities
              <Badge variant="outline" className="ml-1">
                {selectedImage.vulnerabilities.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex gap-2">
              Compliance Issues
              <Badge variant="outline" className="ml-1">
                {selectedImage.compliance_issues.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="layers">
              Layers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vulnerabilities">
            {selectedImage.vulnerabilities.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Fixed In</TableHead>
                      <TableHead>Link</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedImage.vulnerabilities.map((vuln: Vulnerability) => (
                      <TableRow key={vuln.id}>
                        <TableCell className="font-medium">{vuln.id}</TableCell>
                        <TableCell>
                          {vuln.package_name}@{vuln.package_version}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('border', getSeverityColor(vuln.severity))}>
                            {vuln.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{vuln.description}</TableCell>
                        <TableCell>{vuln.fixed_version}</TableCell>
                        <TableCell>
                          <a 
                            href={vuln.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                <h3 className="text-lg font-medium">No vulnerabilities found</h3>
                <p className="mt-2">This image has no detected vulnerabilities.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="compliance">
            {selectedImage.compliance_issues.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Remediation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedImage.compliance_issues.map((issue: ComplianceIssue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.id}</TableCell>
                        <TableCell>
                          <Badge className={cn('border', getSeverityColor(issue.severity))}>
                            {issue.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">{issue.description}</TableCell>
                        <TableCell className="max-w-md">{issue.remediation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                <h3 className="text-lg font-medium">No compliance issues found</h3>
                <p className="mt-2">This image meets all compliance requirements.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="layers">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Layer Digest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedImage.metadata.layers.map((layer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{layer}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Container Images">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image Name</TableHead>
              <TableHead>Vulnerabilities</TableHead>
              <TableHead>Compliance Issues</TableHead>
              <TableHead>Base OS</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Scan Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {containerImages.map((image) => {
              const criticalCount = image.vulnerabilities.filter(v => v.severity === 'Critical').length;
              const highCount = image.vulnerabilities.filter(v => v.severity === 'High').length;
              const mediumCount = image.vulnerabilities.filter(v => v.severity === 'Medium').length;
              const lowCount = image.vulnerabilities.filter(v => v.severity === 'Low').length;
              
              const hasIssues = criticalCount > 0 || highCount > 0;
              
              return (
                <TableRow 
                  key={image.image_digest}
                  className={hasIssues ? "bg-severity-critical/5 hover:bg-severity-critical/10" : ""}
                >
                  <TableCell>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-medium text-left justify-start"
                      onClick={() => handleImageClick(image)}
                    >
                      {image.image_name}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {criticalCount > 0 && (
                        <Badge className="border text-severity-critical bg-severity-critical/10 border-severity-critical/20">
                          {criticalCount} Critical
                        </Badge>
                      )}
                      {highCount > 0 && (
                        <Badge className="border text-severity-high bg-severity-high/10 border-severity-high/20">
                          {highCount} High
                        </Badge>
                      )}
                      {(mediumCount > 0 || lowCount > 0) && (
                        <Badge variant="outline">
                          +{mediumCount + lowCount} more
                        </Badge>
                      )}
                      {criticalCount === 0 && highCount === 0 && mediumCount === 0 && lowCount === 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          No issues
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {image.compliance_issues.length > 0 ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {image.compliance_issues.length} issues
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Compliant
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{image.metadata.os}</TableCell>
                  <TableCell>{image.metadata.size}</TableCell>
                  <TableCell>{new Date(image.scan_date).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  );
}
