
import { StatCard } from '@/components/dashboard/StatCard';
import { Code, AlertTriangle, ShieldAlert, FileCode, BookOpen } from 'lucide-react';

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
}

export function CodeReviewStats({
  totalIssues,
  severityCounts,
  categoryCounts
}: CodeReviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Issues"
        value={totalIssues}
        description="Code issues identified by AI review"
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
        description="Quality and maintainability issues"
        icon={<FileCode className="h-5 w-5" />}
        variant={(categoryCounts.Quality + categoryCounts.Maintainability) > 0 ? "medium" : "default"}
      />
      
      <StatCard
        title="Performance"
        value={categoryCounts.Performance}
        description="Performance optimization opportunities"
        icon={<BookOpen className="h-5 w-5" />}
        variant={categoryCounts.Performance > 0 ? "low" : "default"}
      />
    </div>
  );
}
