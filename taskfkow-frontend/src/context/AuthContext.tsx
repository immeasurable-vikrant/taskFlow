import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for storing user data in localStorage
const USER_STORAGE_KEY = 'app_user_data';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user info is in localStorage on initial load
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUserData = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
        // If there's an error parsing the stored data, clear it
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const saveUserToStorage = (userData: User) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  };

  const clearUserFromStorage = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await authService.login(email, password);
      
      // Save user data to localStorage
      saveUserToStorage(user);
      setUser(user);
      
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await authService.signup(
        firstName,
        lastName,
        email,
        password
      );
      
      // Save user data to localStorage
      saveUserToStorage(user);
      setUser(user);
      
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to signup');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear user data from localStorage
    clearUserFromStorage();
    setUser(null);
    
    navigate('/login');
  };

  // Function to verify token validity in case needed
  const verifySession = async () => {
    // Only check if we think we're logged in
    if (user) {
      try {
        await authService.verifySession();
        return true;
      } catch (error) {
        console.error('Session verification failed:', error);
        // If session verification fails, log the user out
        clearUserFromStorage();
        setUser(null);
        return false;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};