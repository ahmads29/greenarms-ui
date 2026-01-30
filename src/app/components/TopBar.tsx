import { useApp } from "@/app/context/AppContext";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface TopBarProps {
  onMobileMenuClick: () => void;
}

export function TopBar({ onMobileMenuClick }: TopBarProps) {
  const { user, sidebarCollapsed, logout } = useApp();

  return (
    <div className={`h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${sidebarCollapsed ? 'md:left-16' : 'md:left-64'}`}>
      <div className="h-full flex items-center justify-between px-4 md:px-8">
        {/* Left: Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuClick}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-indigo-600 md:hidden">Greenarms</h1>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center gap-3">
          {/* Environment Badge */}
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Production
          </span>

          {/* Role Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>

          {/* Username */}
          <span className="hidden sm:inline text-sm text-gray-700">{user.email}</span>

          {/* Logout Button */}
          <Button variant="ghost" size="icon" title="Logout" onClick={() => logout()}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}