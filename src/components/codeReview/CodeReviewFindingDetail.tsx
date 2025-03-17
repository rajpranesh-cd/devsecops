
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeReviewFinding } from '@/data/codeReviewData';

interface CodeReviewFindingDetailProps {
  finding: CodeReviewFinding;
  onBack: () => void;
  getSeverityColor: (severity: string) => string;
  getCategoryColor: (category: string) => string;
}

export function CodeReviewFindingDetail({
  finding,
  onBack,
  getSeverityColor,
  getCategoryColor
}: CodeReviewFindingDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="-ml-2"
        >
          ← Back to Results
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 mr-1" />
            {finding.repository}
          </Badge>
          <Badge className={cn('border', getSeverityColor(finding.severity))}>
            {finding.severity}
          </Badge>
          <Badge className={cn('border', getCategoryColor(finding.category))}>
            {finding.category}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{finding.title}</h3>
          <p className="text-muted-foreground mt-1">
            {finding.description}
          </p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">File:</span>
            <span className="font-mono">
              {finding.location.file}
              {finding.location.line && `:${finding.location.line}`}
              {finding.location.endLine && `-${finding.location.endLine}`}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Problematic Code</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-auto">
            <code className="text-sm">{finding.codeSnippet}</code>
          </pre>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Recommendation</h4>
          <p className="text-muted-foreground">
            {finding.recommendation}
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Impact Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="text-sm font-medium mb-1">Security Impact</h5>
              <p className="text-sm text-muted-foreground">
                {finding.category === 'Security' 
                  ? 'This issue poses a direct security risk to the application.' 
                  : 'No direct security impact, but may affect overall code robustness.'}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="text-sm font-medium mb-1">Fix Complexity</h5>
              <p className="text-sm text-muted-foreground">
                {finding.severity === 'Critical' || finding.severity === 'High' 
                  ? 'High priority fix recommended.'
                  : 'Medium priority, can be addressed in the next development cycle.'}
              </p>
            </div>
          </div>
        </div>
        
        {finding.references && finding.references.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">References</h4>
            <ul className="text-sm space-y-1">
              {finding.references.map((ref, index) => (
                <li key={index} className="flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-blue-500" />
                  <a 
                    href={ref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {ref}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
