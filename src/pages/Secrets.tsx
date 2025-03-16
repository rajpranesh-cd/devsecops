
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { sampleSecretScanResults } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, EyeOff, RefreshCw, FileKey, Filter, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Secrets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(sampleSecretScanResults);
  const [useSampleData, setUseSampleData] = useState(true);
  
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
  
  // Combine all findings from all repositories
  const allFindings = scanResults.flatMap(repo => repo.findings);
  
  // Filter findings based on search query
  const filteredFindings = allFindings.filter(finding => 
    finding.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.secret_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
  
  const runSecretScan = async () => {
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
      await simulateRealScan(githubToken, githubOrg);
    } catch (error) {
      console.error('Error during secret scanning:', error);
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
      toast.success('Scan completed with sample data');
      setScanResults(sampleSecretScanResults);
      setIsScanning(false);
    }, 2000);
  };

  const simulateRealScan = async (token: string, org: string) => {
    // In a real implementation, this would perform an actual scan using the provided credentials
    // For now, we'll simulate the steps of a real scanning process
    
    toast.info(`Starting scan for organization: ${org}`);
    
    // Simulate repository discovery
    await simulateStep('Discovering repositories...', 1000);
    
    // Simulate branch determination
    await simulateStep('Determining default branches...', 1000);
    
    // Simulate repository syncing
    await simulateStep('Cloning/syncing repositories...', 1500);
    
    // Simulate GitLeaks scanning
    await simulateStep('Running GitLeaks scans...', 2000);
    
    // Simulate result aggregation
    await simulateStep('Aggregating results...', 1000);
    
    // Simulate completion
    toast.success('Scanning completed!');
    
    // In a real implementation, we would update with real results from the scan
    // For this simulation, we'll use the sample data
    setScanResults(sampleSecretScanResults);
  };

  const simulateStep = (message: string, delay: number): Promise<void> => {
    return new Promise(resolve => {
      toast.info(message);
      setTimeout(resolve, delay);
    });
  };

  const handleStartScan = () => {
    runSecretScan();
  };

  const handleExport = (format: 'pdf' | 'json' | 'csv') => {
    // In a real implementation, this would generate and download the file
    // For this demo, we'll just show what would happen
    console.log(`Exporting ${filteredFindings.length} secrets in ${format.toUpperCase()} format`);
    toast.success(`Exporting ${filteredFindings.length} secrets in ${format.toUpperCase()} format`);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <FileKey className="h-5 w-5 mr-2 text-severity-high" />
            <h1 className="text-xl font-semibold">Secret Scanning</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => setShowSecrets(!showSecrets)}>
              {showSecrets ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Secrets
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Secrets
                </>
              )}
            </Button>
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
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter repositories, files, secret types..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <main className="flex-1 overflow-auto p-6">
          <DashboardCard 
            title={`Secret Scanning Results (${filteredFindings.length})`}
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
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Repository</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">File Path</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Line</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Secret Type</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Value</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Author</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFindings.map((finding, index) => (
                    <tr key={index} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-medium">{finding.repository}</td>
                      <td className="py-3 px-4 font-mono text-xs">{finding.file}</td>
                      <td className="py-3 px-4">{finding.line}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-severity-high/10 px-2.5 py-0.5 text-xs font-medium text-severity-high">
                          {finding.secret_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        <code className={cn(
                          "px-1.5 py-0.5 rounded bg-muted",
                          showSecrets ? "" : "blur-sm hover:blur-none transition-all"
                        )}>
                          {finding.secret}
                        </code>
                      </td>
                      <td className="py-3 px-4">{finding.author}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(finding.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  
                  {filteredFindings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No secrets found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </main>
      </div>
    </div>
  );
}
