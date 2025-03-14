
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  FileKey, 
  Code2, 
  Package2, 
  Box, 
  FileText, 
  GitFork, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield 
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type NavItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: BarChart3,
  },
  {
    title: 'Secrets',
    path: '/secrets',
    icon: FileKey,
    badge: 11,
  },
  {
    title: 'SAST',
    path: '/sast',
    icon: Code2,
  },
  {
    title: 'SCA',
    path: '/sca',
    icon: Package2,
    badge: 21,
  },
  {
    title: 'Container Scan',
    path: '/container',
    icon: Box,
  },
  {
    title: 'SBOM',
    path: '/sbom',
    icon: FileText,
  },
  {
    title: 'Supply Chain',
    path: '/supply-chain',
    icon: GitFork,
  },
  {
    title: 'Integration',
    path: '/integration',
    icon: Shield,
  },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div 
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", expanded ? "space-x-3" : "justify-center w-full")}>
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <BarChart3 className="text-primary-foreground h-6 w-6" />
          </div>
          {expanded && (
            <h1 className="text-lg font-semibold text-sidebar-foreground">SecScan</h1>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            !expanded && "hidden"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                    expanded ? "justify-start" : "justify-center",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground"
                    )} />
                    
                    {expanded && (
                      <span className="ml-3 flex-1 truncate whitespace-nowrap">{item.title}</span>
                    )}
                    
                    {expanded && item.badge && (
                      <span className="ml-2 w-5 h-5 rounded-full bg-severity-critical text-white text-xs flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
              expanded ? "justify-start" : "justify-center",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {expanded && <span className="ml-3">Settings</span>}
        </NavLink>
        
        <div className={cn(
          "mt-4 flex items-center",
          expanded ? "justify-between" : "justify-center"
        )}>
          <ThemeToggle />
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
