import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  role: "admin" | "viewer";
  canModify: boolean;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: User;
  currentPage: string;
  navigateTo: (page: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState("login"); // Start at login
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user - Admin role
  const user: User = {
    email: "admin@greenarms.com",
    role: "admin",
    canModify: true,
  };

  const login = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentPage("login");
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppContext.Provider value={{ user, currentPage, navigateTo, sidebarCollapsed, toggleSidebar, isAuthenticated, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}