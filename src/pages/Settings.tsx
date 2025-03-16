
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { AlertCircle, Save, TestTube, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [useSampleData, setUseSampleData] = useState(true);
  
  // GitHub settings
  const [githubToken, setGithubToken] = useState('');
  const [githubOrg, setGithubOrg] = useState('');
  
  // AWS settings
  const [awsAccessKey, setAwsAccessKey] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');
  
  // Scan settings
  const [scanFrequency, setScanFrequency] = useState('daily');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('githubToken') || '';
    const savedOrg = localStorage.getItem('githubOrg') || '';
    const savedUseSampleData = localStorage.getItem('useSampleData');
    
    setGithubToken(savedToken);
    setGithubOrg(savedOrg);
    
    if (savedUseSampleData !== null) {
      setUseSampleData(savedUseSampleData === 'true');
    }
  }, []);

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Save settings to localStorage
    localStorage.setItem('githubToken', githubToken);
    localStorage.setItem('githubOrg', githubOrg);
    localStorage.setItem('useSampleData', useSampleData.toString());
    
    // Simulate API call to save settings
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const handleTestConnection = () => {
    if (!githubToken || !githubOrg) {
      toast.error('GitHub token and organization name are required');
      return;
    }
    
    setTestingConnection(true);
    
    // Simulate API call to test GitHub connection
    setTimeout(() => {
      setTestingConnection(false);
      
      if (githubToken && githubOrg) {
        toast.success('Connection to GitHub successful');
      } else {
        toast.error('Connection failed. Please check your credentials');
      }
    }, 1500);
  };

  const handleToggleSampleData = (checked: boolean) => {
    setUseSampleData(checked);
    localStorage.setItem('useSampleData', checked.toString());
    toast.info(checked ? 'Using sample data' : 'Using live data');
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">Settings</h1>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="credentials" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="scanning">Scanning</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials" className="space-y-6">
              <DashboardCard title="GitHub Integration">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="github-token">
                      GitHub Personal Access Token
                    </Label>
                    <Input
                      id="github-token"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Token must have permission to access repositories.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="github-org">GitHub Organization</Label>
                    <Input
                      id="github-org"
                      placeholder="your-organization"
                      value={githubOrg}
                      onChange={(e) => setGithubOrg(e.target.value)}
                    />
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard title="AWS Integration">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="aws-access-key">AWS Access Key ID</Label>
                    <Input
                      id="aws-access-key"
                      placeholder="AKIAXXXXXXXXXXXXXXXX"
                      value={awsAccessKey}
                      onChange={(e) => setAwsAccessKey(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="aws-secret-key">AWS Secret Access Key</Label>
                    <Input
                      id="aws-secret-key"
                      type="password"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={awsSecretKey}
                      onChange={(e) => setAwsSecretKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for scanning containers and ECR repositories.
                    </p>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard title="Sample Data Mode">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Use Sample Data</h4>
                    <p className="text-xs text-muted-foreground">
                      When enabled, the dashboard will use sample data instead of live scanning.
                    </p>
                  </div>
                  <Switch 
                    checked={useSampleData} 
                    onCheckedChange={handleToggleSampleData} 
                  />
                </div>
              </DashboardCard>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="mr-2 h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="scanning" className="space-y-6">
              <DashboardCard title="Scan Settings">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="scan-frequency">Scan Frequency</Label>
                    <select
                      id="scan-frequency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={scanFrequency}
                      onChange={(e) => setScanFrequency(e.target.value)}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="manual">Manual Only</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="scan-deep" />
                    <Label htmlFor="scan-deep">Enable Deep Scanning</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="scan-containers" defaultChecked />
                    <Label htmlFor="scan-containers">Scan Container Images</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="scan-dependencies" defaultChecked />
                    <Label htmlFor="scan-dependencies">Scan Dependencies</Label>
                  </div>
                </div>
              </DashboardCard>
              
              <div className="bg-muted/50 border rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Scanning Performance Note</h4>
                  <p className="text-xs text-muted-foreground">
                    Deep scanning can significantly increase scan time and resource usage. 
                    It's recommended to schedule deep scans during off-peak hours.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <DashboardCard title="Notification Settings">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-email" defaultChecked />
                    <Label htmlFor="notify-email">Email Notifications</Label>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email-recipients">Email Recipients</Label>
                    <Input
                      id="email-recipients"
                      placeholder="security@example.com, admin@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple email addresses with commas.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-slack" />
                    <Label htmlFor="notify-slack">Slack Notifications</Label>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard title="Alert Thresholds">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="alert-critical">Alert on Critical Findings</Label>
                    <select
                      id="alert-critical"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="any"
                    >
                      <option value="any">Any critical finding</option>
                      <option value="5">5 or more critical findings</option>
                      <option value="10">10 or more critical findings</option>
                      <option value="none">Don't alert on critical</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="alert-high">Alert on High Findings</Label>
                    <select
                      id="alert-high"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="5"
                    >
                      <option value="any">Any high finding</option>
                      <option value="5">5 or more high findings</option>
                      <option value="10">10 or more high findings</option>
                      <option value="none">Don't alert on high</option>
                    </select>
                  </div>
                </div>
              </DashboardCard>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
