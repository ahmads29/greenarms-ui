import { useNavigate, useLocation, useParams } from "react-router-dom";
import { cn } from "@/app/components/ui/utils";
import { useApp } from "@/app/context/AppContext";
import {
    ChevronLeft,
    LayoutDashboard,
    Server,
    AlertTriangle,
    Info,
    ChevronDown,
    ChevronRight,
    ArrowLeft
} from "lucide-react";
import { mockPlants } from "@/app/data/mockData";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";

interface PlantSidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export function PlantSidebar({ isMobileOpen, onMobileClose }: PlantSidebarProps) {
    const { sidebarCollapsed, toggleSidebar } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    const plant = mockPlants.find((p: { id: string }) => p.id === id);

    if (!plant) return null;

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: `/plants/${id}` },
        { id: "devices", label: "Devices", icon: Server, path: `/plants/${id}?tab=devices` }, // Using query params for now as placeholder
        { id: "alerts", label: "Alerts", icon: AlertTriangle, path: `/plants/${id}?tab=alerts` },
        {
            id: "about",
            label: "About",
            icon: Info,
            path: "#",
            children: [
                { id: "plant-info", label: "Plant Info", path: `/plants/${id}?tab=info` }
            ]
        },
    ];

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
                    {/* Top Actions: Collapse & Back */}
                    <div className="flex flex-col border-b border-gray-200">
                        {/* Collapse Toggle Row */}
                        <div className="h-12 flex items-center justify-end px-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSidebar}
                                className="hidden md:flex h-8 w-8"
                            >
                                {sidebarCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        {!sidebarCollapsed && (
                            <div className="px-4 pb-4">
                                <button
                                    onClick={() => navigate("/plants")}
                                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Back to Plant list
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Plant Info Card (Only if expanded) */}
                    {!sidebarCollapsed && (
                        <div className="px-4 py-6 text-center border-b border-gray-200 bg-gray-50">
                            <div className="relative mx-auto w-full aspect-video rounded-lg overflow-hidden shadow-sm mb-3 bg-gray-200">
                                {/* Placeholder for Plant Image - using plant name as seed if real img missing */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
                                    {/* We don't have real images in mockPlants, using a placeholder color/icon */}
                                    <LayoutDashboard className="h-8 w-8 opacity-20" />
                                </div>
                                {/* Overlay Status */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 font-medium">
                                    {plant.status === 'active' ? 'Active' : 'Maintenance'}
                                </div>
                            </div>
                            {/* <h3 className="font-semibold text-gray-900 truncate">{plant.name}</h3> */}
                            <p className="text-sm text-gray-600">Capacity: {plant.capacity_kwp} kWp</p>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path || location.search.includes(item.path.split('?')[1] || 'xyz');
                                const Icon = item.icon;
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
                                                    {item.children?.map(child => (
                                                        <li key={child.id}>
                                                            <button
                                                                onClick={() => handleNavClick(child.path)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors pl-9",
                                                                    location.search === child.path.split('?')[1] ? "text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-900"
                                                                )}
                                                            >
                                                                {child.label}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    )
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
                                                sidebarCollapsed && "justify-center"
                                            )}
                                            title={sidebarCollapsed ? item.label : undefined}
                                        >
                                            <Icon className={cn("h-5 w-5 flex-shrink-0", sidebarCollapsed && "mx-auto")} />
                                            {!sidebarCollapsed && <span>{item.label}</span>}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
