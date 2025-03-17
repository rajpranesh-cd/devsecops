
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeReviewRecommendationsProps {
  getSeverityColor: (severity: string) => string;
  getCategoryColor: (category: string) => string;
}

export function CodeReviewRecommendations({
  getSeverityColor,
  getCategoryColor
}: CodeReviewRecommendationsProps) {
  return (
    <DashboardCard title="Prioritized Recommendations">
      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-severity-critical/20 bg-severity-critical/5">
          <h3 className="text-lg font-medium text-severity-critical mb-2 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Critical Priority Actions
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Badge className="mt-0.5 mr-3" variant="outline">1</Badge>
              <div>
                <p className="font-medium">Fix Insecure Direct Object References</p>
                <p className="text-sm text-muted-foreground">Implement proper authorization checks in the payment-service API to prevent unauthorized data access.</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Badge className={cn('mr-2 border', getSeverityColor('Critical'))}>Critical</Badge>
                  <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <Badge className="mt-0.5 mr-3" variant="outline">2</Badge>
              <div>
                <p className="font-medium">Replace Weak Password Hashing Algorithm</p>
                <p className="text-sm text-muted-foreground">Replace MD5 with bcrypt, Argon2, or PBKDF2 in the auth-service for secure password storage.</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Badge className={cn('mr-2 border', getSeverityColor('Critical'))}>Critical</Badge>
                  <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="p-4 rounded-lg border border-severity-high/20 bg-severity-high/5">
          <h3 className="text-lg font-medium text-severity-high mb-2 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            High Priority Actions
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Badge className="mt-0.5 mr-3" variant="outline">3</Badge>
              <div>
                <p className="font-medium">Sanitize User Input for XSS Prevention</p>
                <p className="text-sm text-muted-foreground">Implement DOMPurify or similar tools to sanitize user-provided content in the web-frontend.</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Badge className={cn('mr-2 border', getSeverityColor('High'))}>High</Badge>
                  <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <Badge className="mt-0.5 mr-3" variant="outline">4</Badge>
              <div>
                <p className="font-medium">Implement API Rate Limiting</p>
                <p className="text-sm text-muted-foreground">Add rate limiting to the api-gateway to prevent brute force and DoS attacks.</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Badge className={cn('mr-2 border', getSeverityColor('Medium'))}>Medium</Badge>
                  <Badge className={cn('mr-2 border', getCategoryColor('Security'))}>Security</Badge>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="p-4 rounded-lg border border-severity-medium/20 bg-severity-medium/5">
          <h3 className="text-lg font-medium text-severity-medium mb-2 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Medium Priority Actions
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Badge className="mt-0.5 mr-3" variant="outline">5</Badge>
              <div>
                <p className="font-medium">Optimize Database Queries</p>
                <p className="text-sm text-muted-foreground">Refactor notification-service to filter users in the database query rather than in-memory.</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Badge className={cn('mr-2 border', getSeverityColor('Medium'))}>Medium</Badge>
                  <Badge className={cn('mr-2 border', getCategoryColor('Performance'))}>Performance</Badge>
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <Badge className="mt-0.5 mr-3" variant="outline">6</Badge>
              <div>
                <p className="font-medium">Code Duplication Refactoring</p>
                <p className="text-sm text-muted-foreground">Extract shared authentication logic into utility functions to reduce duplication.</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Badge className={cn('mr-2 border', getSeverityColor('Low'))}>Low</Badge>
                  <Badge className={cn('mr-2 border', getCategoryColor('Maintainability'))}>Maintainability</Badge>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </DashboardCard>
  );
}
