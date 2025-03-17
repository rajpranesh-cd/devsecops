
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, Download, Clock, ExternalLink, List, FileCode
} from 'lucide-react';
import { sampleCodeReviewFindings, codeReviewSummary, CodeReviewFinding } from '@/data/codeReviewData';
import { CodeReviewStats } from '@/components/codeReview/CodeReviewStats';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { CodeReviewFilters } from '@/components/codeReview/CodeReviewFilters';
import { CodeReviewTable } from '@/components/codeReview/CodeReviewTable';
import { CodeReviewFindingDetail } from '@/components/codeReview/CodeReviewFindingDetail';
import { CodeReviewOverview } from '@/components/codeReview/CodeReviewOverview';
import { CodeReviewRecommendations } from '@/components/codeReview/CodeReviewRecommendations';
import { CodeReviewScanner } from '@/components/codeReview/CodeReviewScanner';
import { AlertTriangle, BookOpen, BarChart3 } from 'lucide-react';

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

  const toggleSeverityFilter = (severity: string) => {
    if (severity === '') {
      setFilterBySeverity([]);
      return;
    }
    
    setFilterBySeverity(prev => 
      prev.includes(severity) ? 
        prev.filter(s => s !== severity) : 
        [...prev, severity]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    if (category === '') {
      setFilterByCategory([]);
      return;
    }
    
    setFilterByCategory(prev => 
      prev.includes(category) ? 
        prev.filter(c => c !== category) : 
        [...prev, category]
    );
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

  const handleExport = (format: 'pdf' | 'json' | 'csv') => {
    console.log(`Exporting ${filteredFindings.length} findings in ${format.toUpperCase()} format`);
    toast.success(`Exporting ${filteredFindings.length} findings in ${format.toUpperCase()} format`);
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
            
            <CodeReviewScanner 
              isScanning={isScanning}
              setIsScanning={setIsScanning}
              useSampleData={useSampleData}
              githubToken={githubToken}
              githubOrg={githubOrg}
            />
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
              <CodeReviewFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterBySeverity={filterBySeverity}
                toggleSeverityFilter={toggleSeverityFilter}
                filterByCategory={filterByCategory}
                toggleCategoryFilter={toggleCategoryFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedRepository={selectedRepository}
                setSelectedRepository={setSelectedRepository}
                repositories={repositories}
                severities={severities}
                categories={categories}
                getSeverityColor={getSeverityColor}
                getCategoryColor={getCategoryColor}
              />
              
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
                  <CodeReviewFindingDetail
                    finding={selectedFinding}
                    onBack={() => setSelectedFinding(null)}
                    getSeverityColor={getSeverityColor}
                    getCategoryColor={getCategoryColor}
                  />
                ) : (
                  <CodeReviewTable
                    findings={filteredFindings}
                    getSeverityColor={getSeverityColor}
                    getCategoryColor={getCategoryColor}
                    onSelectFinding={setSelectedFinding}
                  />
                )}
              </DashboardCard>
            </TabsContent>
            
            <TabsContent value="overview" className="mt-4">
              <CodeReviewOverview
                codeReviewSummary={codeReviewSummary}
                repositoryCount={repositoryCount}
                getSeverityColor={getSeverityColor}
                getCategoryColor={getCategoryColor}
              />
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4">
              <CodeReviewRecommendations
                getSeverityColor={getSeverityColor}
                getCategoryColor={getCategoryColor}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
