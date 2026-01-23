import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  role: "admin" | "viewer";
  canModify: boolean;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  user: User;
  currentPage: string;
  navigateTo: (page: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  registrationEmail: string | null;
  setRegistrationEmail: (email: string) => void;
  isEmailVerified: boolean;
  setIsEmailVerified: (verified: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState("login"); // Start at login
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Mock user - Admin role
  const user: User = {
    email: "admin@greenarms.com",
    role: "admin",
    canModify: true,
  };

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    // In a real app, we would parse the user data or decode the token
    // setUser(userData); 
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentPage("login");
    setRegistrationEmail(null);
    setIsEmailVerified(false);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      currentPage, 
      navigateTo, 
      sidebarCollapsed, 
      toggleSidebar, 
      isAuthenticated, 
      login, 
      logout,
      registrationEmail,
      setRegistrationEmail,
      isEmailVerified,
      setIsEmailVerified
    }}>
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