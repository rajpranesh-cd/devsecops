
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Box, Download, RefreshCw } from 'lucide-react';

export default function Container() {
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Now
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <DashboardCard title="Container Scan Results">
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Container Scanning Features</h3>
              <p className="text-muted-foreground">
                Configure your container settings to begin scanning for vulnerabilities.
              </p>
              <Button className="mt-4">Configure Container Scanning</Button>
            </div>
          </DashboardCard>
        </main>
      </div>
    </div>
  );
}
