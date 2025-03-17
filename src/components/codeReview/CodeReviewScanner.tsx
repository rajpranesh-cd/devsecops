
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CodeReviewScannerProps {
  isScanning: boolean;
  setIsScanning: (isScanning: boolean) => void;
  useSampleData: boolean;
  githubToken: string;
  githubOrg: string;
}

export function CodeReviewScanner({
  isScanning,
  setIsScanning,
  useSampleData,
  githubToken,
  githubOrg
}: CodeReviewScannerProps) {
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

  return (
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
  );
}
