'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  role?: string;
  billing?: any;
  shipping?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token storage helpers
  const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('flora-jwt');
  };

  const setStoredToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('flora-jwt', token);
  };

  const removeStoredToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('flora-jwt');
  };

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate the stored token using our API
        const response = await fetch('/api/woo-auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: storedToken }),
        });

        if (response.ok) {
          const validation = await response.json();
          if (validation.valid) {
            setToken(storedToken);
            // You might want to load user data here if the validation doesn't return it
            // For now, we'll set a basic user object
            // Only set user if we have valid data, otherwise logout
            if (validation.data?.user_id) {
              setUser({
                id: validation.data.user_id.toString(),
                name: validation.data.user_display_name || 'User',
                email: validation.data.user_email || '',
              });
            } else {
              console.warn('Token validation successful but no user data returned');
              removeStoredToken();
            }
          } else {
            removeStoredToken();
          }
        } else {
          removeStoredToken();
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        removeStoredToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/woo-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setStoredToken(data.token);
          setToken(data.token);
          
          // Create user object from response
          const userData: User = {
            id: (data.user.id || data.user.user_id || 'unknown').toString(),
            name: data.user.name || data.user.user_display_name || `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || data.user.username || 'User',
            email: data.user.email || data.user.user_email || '',
            username: data.user.username || data.user.user_nicename || '',
            firstName: data.user.first_name || '',
            lastName: data.user.last_name || '',
            avatar: data.user.avatar_urls?.['96'] || null,
            role: data.user.roles?.[0] || 'customer',
          };

          setUser(userData);
          return true;
        }
      }
      
      try {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
      } catch (e) {
        console.error('Login failed with status:', response.status);
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/woo-auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // After successful registration, try to login
          const loginSuccess = await login(email, password);
          return loginSuccess;
        }
      }
      
      try {
        const errorData = await response.json();
        console.error('Signup failed:', errorData.error);
        
        // Set a more user-friendly error message
        if (errorData.error && errorData.error.includes('already registered')) {
          throw new Error('This email is already registered. Please use the login form instead.');
        } else if (errorData.error) {
          throw new Error(errorData.error);
        } else {
          throw new Error('Registration failed. Please try again.');
        }
      } catch (e) {
        if (e instanceof Error && e.message.includes('already registered')) {
          throw e; // Re-throw specific errors
        }
        console.error('Signup failed with status:', response.status);
        throw new Error(`Registration failed (${response.status}). Please try again.`);
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      // You could implement a user refresh endpoint if needed
      // For now, we'll just validate the token
      const response = await fetch('/api/woo-auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        // Token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeStoredToken();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    isLoading,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 