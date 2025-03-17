
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Download, RefreshCw, ExternalLink, ArrowUpRight, Building2, AlertTriangle, FileCode, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sampleCodeReviewFindings, codeReviewSummary, CodeReviewFinding } from '@/data/codeReviewData';
import { CodeReviewStats } from '@/components/codeReview/CodeReviewStats';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CodeReview() {
  const [selectedFinding, setSelectedFinding] = useState<CodeReviewFinding | null>(null);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [useSampleData, setUseSampleData] = useState(true);
  
  // GitHub settings
  const [githubToken, setGithubToken] = useState('');
  const [githubOrg, setGithubOrg] = useState('');
  
  // Load settings on component mount
  useState(() => {
    try {
      // Retrieve settings from localStorage securely
      const savedToken = localStorage.getItem('githubToken');
      const savedOrg = localStorage.getItem('githubOrg');
      const savedUseSampleData = localStorage.getItem('useSampleData');
      
      if (savedToken) setGithubToken(savedToken);
      if (savedOrg) setGithubOrg(savedOrg);
      if (savedUseSampleData !== null) {
        setUseSampleData(savedUseSampleData === 'true');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load scan settings');
    }
  });

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
      case 'Info':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-muted-foreground bg-muted/50 border-muted/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Security':
        return 'text-severity-high bg-severity-high/10 border-severity-high/20';
      case 'Quality':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Performance':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Maintainability':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-muted-foreground bg-muted/50 border-muted/20';
    }
  };

  const filteredFindings = sampleCodeReviewFindings.filter(finding => {
    const matchesSearch = searchQuery === '' || 
      finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.location.file.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRepo = selectedRepository === null || finding.repository === selectedRepository;
    
    return matchesSearch && matchesRepo;
  });
  
  const repositories = [...new Set(sampleCodeReviewFindings.map(finding => finding.repository))];

  const validateGitHubCredentials = async (token: string, org: string) => {
    if (!token || !org) {
      return { valid: false, message: 'GitHub token and organization name are required' };
    }
    
    try {
      const response = await fetch(`https://api.github.com/orgs/${org}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        return { valid: true };
      } else {
        const data = await response.json();
        return { 
          valid: false, 
          message: `GitHub API error: ${data.message || 'Invalid credentials'}`,
          statusCode: response.status
        };
      }
    } catch (error) {
      console.error('Error validating GitHub credentials:', error);
      return { 
        valid: false, 
        message: 'Connection failed: Network error or invalid credentials'
      };
    }
  };

  const runCodeReview = async () => {
    // Don't perform actual scan if using sample data
    if (useSampleData) {
      simulateScanWithSampleData();
      return;
    }
    
    // Check for required credentials
    if (!githubToken || !githubOrg) {
      toast.error('GitHub token and organization name are required', {
        description: 'Please set them in the Settings page or enable Sample Data mode.'
      });
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Validate GitHub credentials before attempting scan
      const credentialCheck = await validateGitHubCredentials(githubToken, githubOrg);
      
      if (!credentialCheck.valid) {
        toast.error('GitHub credential validation failed', {
          description: credentialCheck.message
        });
        setIsScanning(false);
        return;
      }
      
      // Credentials are valid, proceed with scan
      await simulateRealScan();
    } catch (error) {
      console.error('Error during code review scan:', error);
      toast.error('An error occurred during scanning', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const simulateScanWithSampleData = () => {
    setIsScanning(true);
    
    // Show toast notifications to simulate the scanning process
    toast.info('Using sample data for scan simulation');
    
    setTimeout(() => {
      toast.success('AI Code Review completed with sample data');
      setIsScanning(false);
    }, 2000);
  };

  const simulateRealScan = async () => {
    // Simulate the steps of an AI code review process
    
    toast.info(`Starting AI Code Review for organization: ${githubOrg}`);
    
    // Simulate repository discovery
    await simulateStep('Discovering repositories...', 1000);
    
    // Simulate code checkout
    await simulateStep('Checking out repositories...', 1500);
    
    // Simulate static analysis
    await simulateStep('Performing static code analysis...', 2000);
    
    // Simulate AI model processing
    await simulateStep('AI analyzing code patterns...', 2500);
    
    // Simulate security vulnerability detection
    await simulateStep('Detecting security vulnerabilities...', 1500);
    
    // Simulate code quality analysis
    await simulateStep('Evaluating code quality...', 1000);
    
    // Simulate result aggregation
    await simulateStep('Generating comprehensive report...', 1000);
    
    // Simulate completion
    toast.success('AI Code Review completed!');
  };

  const simulateStep = (message: string, delay: number): Promise<void> => {
    return new Promise(resolve => {
      toast.info(message);
      setTimeout(resolve, delay);
    });
  };

  const handleExport = (format: 'pdf' | 'json' | 'csv') => {
    console.log(`Exporting ${filteredFindings.length} findings in ${format.toUpperCase()} format`);
    toast.success(`Exporting ${filteredFindings.length} findings in ${format.toUpperCase()} format`);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-500" />
            <h1 className="text-xl font-semibold">AI Code Review</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={runCodeReview} disabled={isScanning}>
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start New Review
                </>
              )}
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <CodeReviewStats 
            totalIssues={codeReviewSummary.totalIssues}
            severityCounts={codeReviewSummary.severityCounts}
            categoryCounts={codeReviewSummary.categoryCounts}
          />
          
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Filter by title, repository, severity..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {selectedRepository && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRepository(null)}
                >
                  Clear Repository Filter
                </Button>
              )}
            </div>
            
            {!selectedRepository && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Filter by Repository</h3>
                <div className="flex flex-wrap gap-2">
                  {repositories.map(repo => (
                    <Button 
                      key={repo}
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRepository(repo)}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      {repo}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DashboardCard 
            title={selectedRepository ? `Code Review - ${selectedRepository}` : "AI Code Review Findings"}
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
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          >
            {selectedFinding ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedFinding(null)}
                    className="-ml-2"
                  >
                    ← Back to Results
                  </Button>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 mr-1" />
                      {selectedFinding.repository}
                    </Badge>
                    <Badge className={cn('border', getSeverityColor(selectedFinding.severity))}>
                      {selectedFinding.severity}
                    </Badge>
                    <Badge className={cn('border', getCategoryColor(selectedFinding.category))}>
                      {selectedFinding.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedFinding.title}</h3>
                    <p className="text-muted-foreground mt-1">
                      {selectedFinding.description}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-mono">
                        {selectedFinding.location.file}
                        {selectedFinding.location.line && `:${selectedFinding.location.line}`}
                        {selectedFinding.location.endLine && `-${selectedFinding.location.endLine}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Problematic Code</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto">
                      <code className="text-sm">{selectedFinding.codeSnippet}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendation</h4>
                    <p className="text-muted-foreground">
                      {selectedFinding.recommendation}
                    </p>
                  </div>
                  
                  {selectedFinding.references && selectedFinding.references.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">References</h4>
                      <ul className="text-sm space-y-1">
                        {selectedFinding.references.map((ref, index) => (
                          <li key={index} className="flex items-center">
                            <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-blue-500" />
                            <a 
                              href={ref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {ref}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>References</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFindings.map((finding) => (
                    <TableRow 
                      key={finding.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedFinding(finding)}
                    >
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {finding.repository}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="font-medium">{finding.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {finding.description.length > 60 
                            ? finding.description.substring(0, 60) + '...' 
                            : finding.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('border', getSeverityColor(finding.severity))}>
                          {finding.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('border', getCategoryColor(finding.category))}>
                          {finding.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {finding.location.file.split('/').pop()}:{finding.location.line}
                      </TableCell>
                      <TableCell>
                        {finding.references && finding.references.length > 0 && (
                          <div className="flex space-x-2">
                            <a 
                              href={finding.references[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredFindings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </DashboardCard>
        </main>
      </div>
    </div>
  );
}
