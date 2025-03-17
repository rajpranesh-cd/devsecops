
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart';
import { AlertTriangle, Code, BookOpen, FileCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CodeReviewOverviewProps {
  codeReviewSummary: {
    totalIssues: number;
    severityCounts: {
      Critical: number;
      High: number;
      Medium: number;
      Low: number;
      Info: number;
    };
    categoryCounts: {
      Security: number;
      Quality: number;
      Performance: number;
      Maintainability: number;
    };
  };
  repositoryCount: number;
  getSeverityColor: (severity: string) => string;
  getCategoryColor: (category: string) => string;
}

export function CodeReviewOverview({
  codeReviewSummary,
  repositoryCount,
  getSeverityColor,
  getCategoryColor
}: CodeReviewOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DashboardCard title="Severity Distribution">
        <div className="h-64">
          <SeverityPieChart 
            data={{
              critical: codeReviewSummary.severityCounts.Critical,
              high: codeReviewSummary.severityCounts.High,
              medium: codeReviewSummary.severityCounts.Medium,
              low: codeReviewSummary.severityCounts.Low
            }}
          />
        </div>
      </DashboardCard>
      
      <DashboardCard title="Category Distribution">
        <div className="h-64">
          <SeverityPieChart 
            data={{
              critical: codeReviewSummary.categoryCounts.Security,
              high: codeReviewSummary.categoryCounts.Quality,
              medium: codeReviewSummary.categoryCounts.Performance,
              low: codeReviewSummary.categoryCounts.Maintainability
            }}
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
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-severity-critical" />
                <span>Detected {codeReviewSummary.severityCounts.Critical} critical security vulnerabilities requiring immediate attention</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-severity-high" />
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
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                <span>Performance bottlenecks in database queries and API requests</span>
              </li>
            </ul>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
