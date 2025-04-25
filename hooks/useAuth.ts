import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'therapist';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    role: 'admin' | 'patient' | 'therapist'
  ) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/auth/${role}-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setAuthState({
        user: data.data.user,
        token: data.data.token,
        loading: false,
        error: null,
      });

      // Redirect based on role
      router.push(`/${role}/dashboard`);

    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred during login',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      loading: false,
      error: null,
    });
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return {
    user: authState.user,
    token: authState.token,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!authState.token,
  };
}; 