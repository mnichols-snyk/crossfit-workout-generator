// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

// Define the User type based on the JWT payload
interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'coach' | 'user';
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the application
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const decodedUser = jwtDecode<AuthUser>(token);
          // You might want to add token expiration check here
          setUser(decodedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to decode token or token is invalid:', error);
          authService.logout(); // Clear invalid token
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const decodedUser = jwtDecode<AuthUser>(response.token);
      setUser(decodedUser);
      setIsAuthenticated(true);

      // Add navigation logic here based on user role
      if (decodedUser.role === 'admin') {
        navigate('/admin');
      } else if (decodedUser.role === 'coach') {
        navigate('/coach');
      } else if (decodedUser.role === 'user') {
        navigate('/user');
      } else {
        navigate('/'); // Fallback for unknown roles
      }

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page on logout
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
