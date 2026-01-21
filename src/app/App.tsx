import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/app/context/AppContext";
import { MainLayout } from "@/app/components/MainLayout";
import { Dashboard } from "@/app/pages/Dashboard";
import { Plants } from "@/app/pages/Plants";
import { PlantDetail } from "@/app/pages/PlantDetail";
import { Devices } from "@/app/pages/Devices";
import { DeviceDetail } from "@/app/pages/DeviceDetail";
import { Alarms } from "@/app/pages/Alarms";
import { Prices } from "@/app/pages/Prices";
import { Schedules } from "@/app/pages/Schedules";
import { PriceFeeds } from "@/app/pages/PriceFeeds";
import { Fleet } from "@/app/pages/Fleet";
import { DispatchLogs } from "@/app/pages/DispatchLogs";
import { AuditLogs } from "@/app/pages/AuditLogs";
import { LoginPage } from "@/app/pages/auth/LoginPage";
import { RegisterPage } from "@/app/pages/auth/RegisterPage";
import { Toaster } from "sonner";

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useApp();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

// Auth Route wrapper (redirect to dashboard if already authenticated)
function AuthRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useApp();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}

function AppContent() {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
                <AuthRoute>
                    <LoginPage />
                </AuthRoute>
            } />
            <Route path="/register" element={
                <AuthRoute>
                    <RegisterPage />
                </AuthRoute>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Dashboard />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Dashboard />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/plants" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Plants />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/plants/:id" element={
                <ProtectedRoute>
                    <MainLayout>
                        <PlantDetail />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/devices" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Devices />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/devices/:id" element={
                <ProtectedRoute>
                    <MainLayout>
                        <DeviceDetail />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/alarms" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Alarms />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/prices" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Prices />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/schedules" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Schedules />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/price-feeds" element={
                <ProtectedRoute>
                    <MainLayout>
                        <PriceFeeds />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/fleet" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Fleet />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/dispatch-logs" element={
                <ProtectedRoute>
                    <MainLayout>
                        <DispatchLogs />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/audit" element={
                <ProtectedRoute>
                    <MainLayout>
                        <AuditLogs />
                        <Toaster />
                    </MainLayout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </BrowserRouter>
    );
}
