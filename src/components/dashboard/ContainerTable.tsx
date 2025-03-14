
import { useState } from 'react';
import { AlertTriangle, Download, ExternalLink, FileJson, FileText, Printer } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ContainerIssue {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  references: string;
}

interface ContainerRepo {
  repository: string;
  issues: ContainerIssue[];
}

interface ContainerTableProps {
  data: ContainerRepo[];
}

export function ContainerTable({ data }: ContainerTableProps) {
  const [openRepo, setOpenRepo] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<ContainerIssue | null>(null);

  const handleExport = (format: 'pdf' | 'json' | 'csv') => {
    // In a real implementation, this would generate and download the file
    // For this demo, we'll just show what would happen
    const repositories = data.map(repo => repo.repository).join(', ');
    const totalIssues = data.reduce((acc, repo) => acc + repo.issues.length, 0);
    
    console.log(`Exporting ${totalIssues} issues from ${repositories} in ${format.toUpperCase()} format`);
    alert(`Exporting ${totalIssues} issues in ${format.toUpperCase()} format`);
  };

  return (
    <DashboardCard 
      title="Container Security Issues" 
      action={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              <FileJson className="h-4 w-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <Printer className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>References</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((repo) => (
              <Collapsible
                key={repo.repository}
                open={openRepo === repo.repository}
                onOpenChange={() => {
                  if (openRepo === repo.repository) {
                    setOpenRepo(null);
                  } else {
                    setOpenRepo(repo.repository);
                  }
                }}
              >
                <CollapsibleTrigger asChild>
                  <TableRow className="cursor-pointer hover:bg-muted">
                    <TableCell colSpan={5} className="font-medium">
                      {repo.repository} 
                      <span className="ml-2 text-muted-foreground text-sm">
                        ({repo.issues.length} issues)
                      </span>
                    </TableCell>
                  </TableRow>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {repo.issues.map((issue) => (
                    <TableRow 
                      key={issue.id}
                      className="bg-muted/40 hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <TableCell className="pl-8"></TableCell>
                      <TableCell>{issue.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={cn(
                            "text-xs px-2.5 py-1 rounded-full flex items-center font-medium",
                            {
                              "bg-severity-critical/10 text-severity-critical": issue.severity === 'Critical',
                              "bg-severity-high/10 text-severity-high": issue.severity === 'High',
                              "bg-severity-medium/10 text-severity-medium": issue.severity === 'Medium',
                              "bg-severity-low/10 text-severity-low": issue.severity === 'Low',
                            }
                          )}>
                            <AlertTriangle className="h-3 w-3 mr-1.5" />
                            {issue.severity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{issue.location}</TableCell>
                      <TableCell>
                        <a 
                          href={issue.references} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Docs <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={cn(
                "inline-block w-3 h-3 rounded-full",
                {
                  "bg-severity-critical": selectedIssue?.severity === 'Critical',
                  "bg-severity-high": selectedIssue?.severity === 'High',
                  "bg-severity-medium": selectedIssue?.severity === 'Medium',
                  "bg-severity-low": selectedIssue?.severity === 'Low',
                }
              )}></span> 
              {selectedIssue?.title}
            </DialogTitle>
            <DialogDescription className="pt-2">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="font-medium">Severity</div>
                    <div className={cn(
                      "mt-1",
                      {
                        "text-severity-critical": selectedIssue?.severity === 'Critical',
                        "text-severity-high": selectedIssue?.severity === 'High',
                        "text-severity-medium": selectedIssue?.severity === 'Medium',
                        "text-severity-low": selectedIssue?.severity === 'Low',
                      }
                    )}>{selectedIssue?.severity}</div>
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="mt-1 font-mono text-xs">{selectedIssue?.location}</div>
                  </div>
                  <div>
                    <div className="font-medium">References</div>
                    <div className="mt-1">
                      <a 
                        href={selectedIssue?.references} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                      >
                        Documentation <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="font-medium mb-2">Description</div>
                  <div className="bg-muted/50 p-4 rounded-md text-sm">
                    This container vulnerability could allow unauthorized access to sensitive data. 
                    The issue is present in the container configuration and should be addressed by 
                    updating the container security settings according to the recommended guidelines.
                  </div>
                </div>

                <div className="mt-4">
                  <div className="font-medium mb-2">Remediation</div>
                  <div className="bg-muted/50 p-4 rounded-md text-sm">
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>Update the container image to the latest secure version</li>
                      <li>Apply the security patch mentioned in the reference documentation</li>
                      <li>Implement proper access controls for the container registry</li>
                      <li>Scan the container image again to verify the issue has been resolved</li>
                    </ol>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
}
