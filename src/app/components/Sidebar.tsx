import { useApp } from "@/app/context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/app/components/ui/utils";
import {
  Home,
  Building2,
  Settings,
  Bell,
  DollarSign,
  Calendar,
  RefreshCw,
  Truck,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: Activity,
    path: "/monitoring",
    children: [
      { id: "plants", label: "Plants", icon: Building2, path: "/plants" },
      { id: "devices", label: "Devices", icon: Settings, path: "/devices" },
      { id: "alarms", label: "Alarms", icon: Bell, path: "/alarms" },
    ],
  },
  { id: "prices", label: "Prices", icon: DollarSign, path: "/prices" },
  { id: "schedules", label: "Schedules", icon: Calendar, path: "/schedules" },
  { id: "price-feeds", label: "Price Feeds", icon: RefreshCw, path: "/price-feeds" },
  { id: "fleet", label: "Fleet", icon: Truck, path: "/fleet" },
  { id: "dispatch-logs", label: "Dispatch Logs", icon: FileText, path: "/dispatch-logs" },
  { id: "audit", label: "Audit Logs", icon: ShieldCheck, path: "/audit" },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const handleNavClick = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.id);

    if (hasChildren && !sidebarCollapsed) {
      return (
        <li key={item.id}>
          <button
            onClick={() => toggleSection(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>
          {isExpanded && (
            <ul className="ml-4 mt-1 space-y-1">
              {item.children?.map((child) => renderNavItem(child, true))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.id}>
        <button
          onClick={() => handleNavClick(item.path)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
              : "text-gray-700 hover:bg-gray-100",
            sidebarCollapsed && "justify-center",
            isChild && !sidebarCollapsed && "pl-6"
          )}
          title={sidebarCollapsed ? item.label : undefined}
        >
          <Icon className={cn("h-5 w-5 flex-shrink-0", sidebarCollapsed && "mx-auto")} />
          {!sidebarCollapsed && <span>{item.label}</span>}
        </button>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Collapse Button */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-indigo-600">Greenarms</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => renderNavItem(item))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}