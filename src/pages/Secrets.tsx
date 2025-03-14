
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { sampleSecretScanResults } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, EyeOff, RefreshCw, FileKey, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  
  // Combine all findings from all repositories
  const allFindings = sampleSecretScanResults.flatMap(repo => repo.findings);
  
  // Filter findings based on search query
  const filteredFindings = allFindings.filter(finding => 
    finding.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.secret_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleExport = (format: 'pdf' | 'json' | 'csv') => {
    // In a real implementation, this would generate and download the file
    // For this demo, we'll just show what would happen
    console.log(`Exporting ${filteredFindings.length} secrets in ${format.toUpperCase()} format`);
    alert(`Exporting ${filteredFindings.length} secrets in ${format.toUpperCase()} format`);
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
