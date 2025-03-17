
import { useState } from 'react';
import { Filter, Search, Sliders, Building2, AlertTriangle, FileCode, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface CodeReviewFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterBySeverity: string[];
  toggleSeverityFilter: (severity: string) => void;
  filterByCategory: string[];
  toggleCategoryFilter: (category: string) => void;
  sortBy: 'severity' | 'repository' | 'category' | 'date';
  setSortBy: (sortBy: 'severity' | 'repository' | 'category' | 'date') => void;
  selectedRepository: string | null;
  setSelectedRepository: (repo: string | null) => void;
  repositories: string[];
  severities: string[];
  categories: string[];
  getSeverityColor: (severity: string) => string;
  getCategoryColor: (category: string) => string;
}

export function CodeReviewFilters({
  searchQuery,
  setSearchQuery,
  filterBySeverity,
  toggleSeverityFilter,
  filterByCategory,
  toggleCategoryFilter,
  sortBy,
  setSortBy,
  selectedRepository,
  setSelectedRepository,
  repositories,
  severities,
  categories,
  getSeverityColor,
  getCategoryColor,
}: CodeReviewFiltersProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search in findings..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {(filterBySeverity.length > 0 || filterByCategory.length > 0) && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                  {filterBySeverity.length + filterByCategory.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Severity</DropdownMenuLabel>
              {severities.map(severity => (
                <DropdownMenuCheckboxItem
                  key={severity}
                  checked={filterBySeverity.includes(severity)}
                  onCheckedChange={() => toggleSeverityFilter(severity)}
                >
                  <Badge className={cn('mr-2 border', getSeverityColor(severity))}>
                    {severity}
                  </Badge>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Category</DropdownMenuLabel>
              {categories.map(category => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={filterByCategory.includes(category)}
                  onCheckedChange={() => toggleCategoryFilter(category)}
                >
                  <Badge className={cn('mr-2 border', getCategoryColor(category))}>
                    {category}
                  </Badge>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
            
            {(filterBySeverity.length > 0 || filterByCategory.length > 0) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    toggleSeverityFilter('');
                    toggleCategoryFilter('');
                  }}
                >
                  Clear all filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Sliders className="h-4 w-4 mr-2" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <DropdownMenuRadioItem value="severity">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Severity
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="repository">
                <Building2 className="h-4 w-4 mr-2" />
                Repository
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="category">
                <FileCode className="h-4 w-4 mr-2" />
                Category
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="date">
                <Calendar className="h-4 w-4 mr-2" />
                Date
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {selectedRepository && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRepository(null)}
            className="flex items-center"
          >
            <Building2 className="h-4 w-4 mr-2" />
            {selectedRepository}
            <Badge className="ml-2">Clear</Badge>
          </Button>
        )}
      </div>
      
      {!selectedRepository && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Repositories</h3>
          <div className="flex flex-wrap gap-2">
            {repositories.map(repo => (
              <Button 
                key={repo}
                size="sm"
                variant="outline"
                onClick={() => setSelectedRepository(repo)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                {repo}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
