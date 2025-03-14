
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Filter, RefreshCw, Shield, GitMerge, Terminal, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface IntegrationTool {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  logoUrl?: string;
  website: string;
  connected: boolean;
}

export default function Integration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<IntegrationTool[]>([
    {
      id: 'trivy',
      name: 'Trivy',
      description: 'Comprehensive vulnerability scanner for containers and dependencies',
      capabilities: ['SCA', 'Container Scan'],
      website: 'https://trivy.dev/',
      connected: false
    },
    {
      id: 'semgrep',
      name: 'Semgrep',
      description: 'Fast, open-source static analysis for finding bugs and enforcing code standards',
      capabilities: ['SAST', 'SCA'],
      website: 'https://semgrep.dev/',
      connected: false
    },
    {
      id: 'snyk',
      name: 'Snyk',
      description: 'Find, fix and monitor vulnerabilities in code, dependencies, and infrastructure',
      capabilities: ['SAST', 'SCA', 'Container Scan'],
      website: 'https://snyk.io/',
      connected: false
    }
  ]);

  const handleConnect = (toolId: string) => {
    setTools(prevTools => 
      prevTools.map(tool => 
        tool.id === toolId ? { ...tool, connected: !tool.connected } : tool
      )
    );
    
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      if (!tool.connected) {
        toast.success(`${tool.name} successfully connected`);
      } else {
        toast.info(`${tool.name} disconnected`);
      }
    }
  };

  // Filter tools based on search query
  const filteredTools = tools.filter(tool => {
    return searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Get icon for a capability
  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'SAST':
        return <GitMerge className="h-4 w-4 mr-1" />;
      case 'SCA':
        return <Terminal className="h-4 w-4 mr-1" />;
      case 'Container Scan':
        return <Shield className="h-4 w-4 mr-1" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            <h1 className="text-xl font-semibold">Integration</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
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
              placeholder="Filter tools by name, capability..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <main className="flex-1 overflow-auto p-6">
          <DashboardCard 
            title="Security Tools Integration" 
            className="mb-6"
          >
            <p className="text-muted-foreground mb-4">
              Connect to your security scanning tools to consolidate all your security findings in one place.
              These integrations allow you to run scans and view results directly from this dashboard.
            </p>
          </DashboardCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{tool.name}</CardTitle>
                      <CardDescription className="mt-1">{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.capabilities.map((capability) => (
                      <Badge key={capability} variant="outline" className="flex items-center">
                        {getCapabilityIcon(capability)}
                        {capability}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <a 
                      href={tool.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Visit website
                    </a>
                    <Button 
                      variant={tool.connected ? "destructive" : "default"}
                      onClick={() => handleConnect(tool.id)}
                      size="sm"
                    >
                      {tool.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
