
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeReviewFinding } from '@/data/codeReviewData';

interface CodeReviewTableProps {
  findings: CodeReviewFinding[];
  getSeverityColor: (severity: string) => string;
  getCategoryColor: (category: string) => string;
  onSelectFinding: (finding: CodeReviewFinding) => void;
}

export function CodeReviewTable({
  findings,
  getSeverityColor,
  getCategoryColor,
  onSelectFinding
}: CodeReviewTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Repository</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>References</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {findings.map((finding) => (
          <TableRow 
            key={finding.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSelectFinding(finding)}
          >
            <TableCell>
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {finding.repository}
              </Badge>
            </TableCell>
            <TableCell className="max-w-md">
              <div className="font-medium">{finding.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {finding.description.length > 60 
                  ? finding.description.substring(0, 60) + '...' 
                  : finding.description}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={cn('border', getSeverityColor(finding.severity))}>
                {finding.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={cn('border', getCategoryColor(finding.category))}>
                {finding.category}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-sm">
              {finding.location.file.split('/').pop()}:{finding.location.line}
            </TableCell>
            <TableCell>
              {finding.references && finding.references.length > 0 && (
                <div className="flex space-x-2">
                  <a 
                    href={finding.references[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
        
        {findings.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
