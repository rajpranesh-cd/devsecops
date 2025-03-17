
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, Download, RefreshCw, ExternalLink, ArrowUpRight, Building2, 
  AlertTriangle, FileCode, Filter, Search, Sliders, BookOpen, 
  Clock, Calendar, BarChart3, List
} from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart';

export default function CodeReview() {
  const [selectedFinding, setSelectedFinding] = useState<CodeReviewFinding | null>(null);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [useSampleData, setUseSampleData] = useState(true);
  const [activeTab, setActiveTab] = useState('findings');
  const [sortBy, setSortBy] = useState<'severity' | 'repository' | 'category' | 'date'>('severity');
  const [filterBySeverity, setFilterBySeverity] = useState<string[]>([]);
  const [filterByCategory, setFilterByCategory] = useState<string[]>([]);
  
  // GitHub settings
  const [githubToken, setGithubToken] = useState('');
  const [githubOrg, setGithubOrg] = useState('');
  
  // Load settings on component mount
  useEffect(() => {
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
  }, []);

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

  const filteredFindings = sampleCodeReviewFindings
    .filter(finding => {
      // Text search
      const matchesSearch = searchQuery === '' || 
        finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finding.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finding.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finding.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finding.location.file.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Repository filter
      const matchesRepo = selectedRepository === null || finding.repository === selectedRepository;
      
      // Severity filter
      const matchesSeverity = filterBySeverity.length === 0 || filterBySeverity.includes(finding.severity);
      
      // Category filter
      const matchesCategory = filterByCategory.length === 0 || filterByCategory.includes(finding.category);
      
      return matchesSearch && matchesRepo && matchesSeverity && matchesCategory;
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case 'severity':
          const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
          return severityOrder[a.severity as keyof typeof severityOrder] - 
                 severityOrder[b.severity as keyof typeof severityOrder];
        case 'repository':
          return a.repository.localeCompare(b.repository);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
          // Assuming we would have a date property, for now just return 0
          return 0;
        default:
          return 0;
      }
    });
  
  const repositories = [...new Set(sampleCodeReviewFindings.map(finding => finding.repository))];
  const severities = ['Critical', 'High', 'Medium', 'Low', 'Info'];
  const categories = ['Security', 'Quality', 'Performance', 'Maintainability'];

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
    
    // Simulate performance analysis
    await simulateStep('Analyzing performance bottlenecks...', 1200);
    
    // Simulate maintainability assessment
    await simulateStep('Assessing code maintainability...', 1300);
    
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

  const toggleSeverityFilter = (severity: string) => {
    setFilterBySeverity(prev => 
      prev.includes(severity) ? 
        prev.filter(s => s !== severity) : 
        [...prev, severity]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setFilterByCategory(prev => 
      prev.includes(category) ? 
        prev.filter(c => c !== category) : 
        [...prev, category]
    );
  };

  // Calculate some additional stats for enhanced UI
  const filesReviewed = 35; // This would be dynamic in a real implementation
  const repositoryCount = repositories.length;

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
                  <FileCode className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <Code className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <List className="h-4 w-4 mr-2" />
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
            repositoryCount={repositoryCount}
            filesReviewed={filesReviewed}
          />
          
          <Tabs defaultValue="findings" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="findings" className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Findings
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="findings" className="mt-4">
              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[240px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search in findings..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {(filterBySeverity.length > 0 || filterByCategory.length > 0) && (
                          <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                            {filterBySeverity.length + filterByCategory.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Severity</DropdownMenuLabel>
                        {severities.map(severity => (
                          <DropdownMenuCheckboxItem
                            key={severity}
                            checked={filterBySeverity.includes(severity)}
                            onCheckedChange={() => toggleSeverityFilter(severity)}
                          >
                            <Badge className={cn('mr-2 border', getSeverityColor(severity))}>
                              {severity}
                            </Badge>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Category</DropdownMenuLabel>
                        {categories.map(category => (
                          <DropdownMenuCheckboxItem
                            key={category}
                            checked={filterByCategory.includes(category)}
                            onCheckedChange={() => toggleCategoryFilter(category)}
                          >
                            <Badge className={cn('mr-2 border', getCategoryColor(category))}>
                              {category}
                            </Badge>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuGroup>
                      
                      {(filterBySeverity.length > 0 || filterByCategory.length > 0) && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setFilterBySeverity([]);
                              setFilterByCategory([]);
                            }}
                          >
                            Clear all filters
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Sliders className="h-4 w-4 mr-2" />
                        Sort by
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                        <DropdownMenuRadioItem value="severity">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Severity
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="repository">
                          <Building2 className="h-4 w-4 mr-2" />
                          Repository
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="category">
                          <FileCode className="h-4 w-4 mr-2" />
                          Category
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="date">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {selectedRepository && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRepository(null)}
                      className="flex items-center"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      {selectedRepository}
                      <Badge className="ml-2">Clear</Badge>
                    </Button>
                  )}
                </div>
                
                {!selectedRepository && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Repositories</h3>
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Updated 2 hours ago
                    </Badge>
                    
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
                  </div>
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
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Impact Analysis</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <h5 className="text-sm font-medium mb-1">Security Impact</h5>
                            <p className="text-sm text-muted-foreground">
                              {selectedFinding.category === 'Security' 
                                ? 'This issue poses a direct security risk to the application.' 
                                : 'No direct security impact, but may affect overall code robustness.'}
                            </p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <h5 className="text-sm font-medium mb-1">Fix Complexity</h5>
                            <p className="text-sm text-muted-foreground">
                              {selectedFinding.severity === 'Critical' || selectedFinding.severity === 'High' 
                                ? 'High priority fix recommended.'
                                : 'Medium priority, can be addressed in the next development cycle.'}
                            </p>
                          </div>
                        </div>
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
            </TabsContent>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard title="Severity Distribution">
                  <div className="h-64">
                    <SeverityPieChart 
                      data={[
                        { name: 'Critical', value: codeReviewSummary.severityCounts.Critical, color: 'var(--severity-critical)' },
                        { name: 'High', value: codeReviewSummary.severityCounts.High, color: 'var(--severity-high)' },
                        { name: 'Medium', value: codeReviewSummary.severityCounts.Medium, color: 'var(--severity-medium)' },
                        { name: 'Low', value: codeReviewSummary.severityCounts.Low, color: 'var(--severity-low)' },
                        { name: 'Info', value: codeReviewSummary.severityCounts.Info, color: '#6e56cf' }
                      ]}
                    />
                  </div>
                </DashboardCard>
                
                <DashboardCard title="Category Distribution">
                  <div className="h-64">
                    <SeverityPieChart 
                      data={[
                        { name: 'Security', value: codeReviewSummary.categoryCounts.Security, color: 'var(--severity-high)' },
                        { name: 'Quality', value: codeReviewSummary.categoryCounts.Quality, color: '#3b82f6' },
                        { name: 'Performance', value: codeReviewSummary.categoryCounts.Performance, color: '#f59e0b' },
                        { name: 'Maintainability', value: codeReviewSummary.categoryCounts.Maintainability, color: '#8b5cf6' }
                      ]}
                    />
                  </div>
                </DashboardCard>
                
                <DashboardCard title="Executive Summary" className="md:col-span-2">
                  <div className="p-4 rounded-lg bg-muted/50 mb-4">
                    <h3 className="text-lg font-medium mb-2">Overall Assessment</h3>
                    <p className="text-muted-foreground">
                      The AI code review has identified {codeReviewSummary.totalIssues} issues across {repositoryCount} repositories, 
                      with {codeReviewSummary.severityCounts.Critical} critical and {codeReviewSummary.severityCounts.High} high severity issues. 
                      Most issues ({codeReviewSummary.categoryCounts.Security} findings) are related to security vulnerabilities, 
                      followed by code quality concerns.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium flex items-center mb-3">
                        <AlertTriangle className="h-4 w-4 mr-2 text-severity-high" />
                        Key Security Findings
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <Bug className="h-4 w-4 mr-2 mt-0.5 text-severity-critical" />
                          <span>Detected {codeReviewSummary.severityCounts.Critical} critical security vulnerabilities requiring immediate attention</span>
                        </li>
                        <li className="flex items-start">
                          <ShieldAlert className="h-4 w-4 mr-2 mt-0.5 text-severity-high" />
                          <span>Identified potential injection vulnerabilities in API endpoints</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-severity-medium" />
                          <span>Found insecure direct object references in user data access</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium flex items-center mb-3">
                        <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                        Code Quality Concerns
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <Code className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                          <span>Observed code duplication in authentication flows</span>
                        </li>
                        <li className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                          <span>Documentation is inconsistent across repositories</span>
                        </li>
                        <li className="flex items-start">
                          <Activity className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                          <span>Performance bottlenecks in database queries and API requests</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4">
              <DashboardCard title="Prioritized Recommendations">
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border border-severity-critical/20 bg-severity-critical/5">
                    <h3 className="text-lg font-medium text-severity-critical mb-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Critical Priority Actions
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-3" variant="outline">1</Badge>
                        <div>
                          <p className="font-medium">Fix Insecure Direct Object References</p>
                          <p className="text-sm text-muted-foreground">Implement proper authorization checks in the payment-service API to prevent unauthorized data access.</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Badge className={cn('mr-2 border', getSeverityColor('Critical'))}>Critical</Badge>
                            <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-3" variant="outline">2</Badge>
                        <div>
                          <p className="font-medium">Replace Weak Password Hashing Algorithm</p>
                          <p className="text-sm text-muted-foreground">Replace MD5 with bcrypt, Argon2, or PBKDF2 in the auth-service for secure password storage.</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Badge className={cn('mr-2 border', getSeverityColor('Critical'))}>Critical</Badge>
                            <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-severity-high/20 bg-severity-high/5">
                    <h3 className="text-lg font-medium text-severity-high mb-2 flex items-center">
                      <ShieldAlert className="h-5 w-5 mr-2" />
                      High Priority Actions
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-3" variant="outline">3</Badge>
                        <div>
                          <p className="font-medium">Sanitize User Input for XSS Prevention</p>
                          <p className="text-sm text-muted-foreground">Implement DOMPurify or similar tools to sanitize user-provided content in the web-frontend.</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Badge className={cn('mr-2 border', getSeverityColor('High'))}>High</Badge>
                            <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-3" variant="outline">4</Badge>
                        <div>
                          <p className="font-medium">Implement API Rate Limiting</p>
                          <p className="text-sm text-muted-foreground">Add rate limiting to the api-gateway to prevent brute force and DoS attacks.</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Badge className={cn('mr-2 border', getSeverityColor('Medium'))}>Medium</Badge>
                            <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-severity-medium/20 bg-severity-medium/5">
                    <h3 className="text-lg font-medium text-severity-medium mb-2 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Medium Priority Actions
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-3" variant="outline">5</Badge>
                        <div>
                          <p className="font-medium">Optimize Database Queries</p>
                          <p className="text-sm text-muted-foreground">Refactor notification-service to filter users in the database query rather than in-memory.</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Badge className={cn('mr-2 border', getSeverityColor('Medium'))}>Medium</Badge>
                            <Badge className={cn('mr-2 border', getCategoryColor('Performance'))}>Performance</Badge>
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-3" variant="outline">6</Badge>
                        <div>
                          <p className="font-medium">Code Duplication Refactoring</p>
                          <p className="text-sm text-muted-foreground">Extract shared authentication logic into utility functions to reduce duplication.</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Badge className={cn('mr-2 border', getSeverityColor('Low'))}>Low</Badge>
                            <Badge className={cn('mr-2 border', getCategoryColor('Maintainability'))}>Maintainability</Badge>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </DashboardCard>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
