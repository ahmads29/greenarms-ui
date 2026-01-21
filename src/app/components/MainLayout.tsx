import { useState } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { PlantSidebar } from "@/app/components/PlantSidebar";
import { TopBar } from "@/app/components/TopBar";
import { useApp } from "@/app/context/AppContext";
import { useLocation, matchPath } from "react-router-dom";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { sidebarCollapsed } = useApp();
    const location = useLocation();

    // Check if we are in a plant detail context (e.g. /plants/123) but NOT the main list (/plants)
    const isPlantDetail = matchPath("/plants/:id/*", location.pathname) || matchPath("/plants/:id", location.pathname);

    return (
        <div className="min-h-screen bg-gray-50">
            {isPlantDetail ? (
                <PlantSidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
            ) : (
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
            )}

            <TopBar onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />

            <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
