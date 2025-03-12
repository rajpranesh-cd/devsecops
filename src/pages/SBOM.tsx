
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { FileText, Download, RefreshCw } from 'lucide-react';

export default function SBOM() {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            <h1 className="text-xl font-semibold">Software Bill of Materials</h1>
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
          <DashboardCard title="SBOM Results">
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">SBOM Features</h3>
              <p className="text-muted-foreground">
                Configure your SBOM settings to begin generating software bill of materials.
              </p>
              <Button className="mt-4">Configure SBOM</Button>
            </div>
          </DashboardCard>
        </main>
      </div>
    </div>
  );
}
