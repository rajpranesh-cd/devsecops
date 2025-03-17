
import { StatCard } from '@/components/dashboard/StatCard';
import { Code, AlertTriangle, ShieldAlert, FileCode, BookOpen, Activity, Bug } from 'lucide-react';

interface CodeReviewStatsProps {
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
  repositoryCount: number;
  filesReviewed: number;
}

export function CodeReviewStats({
  totalIssues,
  severityCounts,
  categoryCounts,
  repositoryCount,
  filesReviewed
}: CodeReviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Issues"
        value={totalIssues}
        description={`Across ${repositoryCount} repositories`}
        icon={<Code className="h-5 w-5" />}
        variant={totalIssues > 0 ? "critical" : "default"}
      />
      
      <StatCard
        title="Security Issues"
        value={categoryCounts.Security}
        description={`Critical: ${severityCounts.Critical}, High: ${severityCounts.High}`}
        icon={<ShieldAlert className="h-5 w-5" />}
        variant={categoryCounts.Security > 0 ? "critical" : "default"}
      />
      
      <StatCard
        title="Code Quality"
        value={categoryCounts.Quality + categoryCounts.Maintainability}
        description={`Quality: ${categoryCounts.Quality}, Maintainability: ${categoryCounts.Maintainability}`}
        icon={<FileCode className="h-5 w-5" />}
        variant={(categoryCounts.Quality + categoryCounts.Maintainability) > 0 ? "medium" : "default"}
      />
      
      <StatCard
        title="Performance"
        value={categoryCounts.Performance}
        description={`${filesReviewed} files reviewed`}
        icon={<Activity className="h-5 w-5" />}
        variant={categoryCounts.Performance > 0 ? "low" : "default"}
      />
    </div>
  );
}
