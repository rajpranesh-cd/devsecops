
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Code2, Download, RefreshCw } from 'lucide-react';

export default function SAST() {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <Code2 className="h-5 w-5 mr-2 text-blue-500" />
            <h1 className="text-xl font-semibold">Static Application Security Testing</h1>
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
          <DashboardCard title="SAST Scan Results">
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Static Analysis Features</h3>
              <p className="text-muted-foreground">
                Configure your SAST settings to begin scanning for code vulnerabilities.
              </p>
              <Button className="mt-4">Configure SAST</Button>
            </div>
          </DashboardCard>
        </main>
      </div>
    </div>
  );
}
