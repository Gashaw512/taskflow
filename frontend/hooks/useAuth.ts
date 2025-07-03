import { useState, useEffect, useCallback } from 'react';
import { User } from '../entities/User'; 
import { useTranslation } from 'react-i18next';
import { getDefaultHeaders, handleAuthResponse, isAuthError } from '../utils/authUtils'; 

interface UseAuthReturn {
  currentUser: User | null;
  loading: boolean;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/current_user', {
        credentials: 'include',
        headers: getDefaultHeaders(),
      });

      const authHandledResponse = await handleAuthResponse(response, 'Failed to fetch user data');

      const data = await authHandledResponse.json();
      if (data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      if (isAuthError(err)) {
        setCurrentUser(null);
      } else {
        setCurrentUser(null); 
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user on component mount or i18n initialization
  useEffect(() => {
    if (i18n.isInitialized) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, i18n.isInitialized]);

  // Listen for login events to update user state
  useEffect(() => {
    const handleUserLoggedIn = (event: CustomEvent) => {
      const user = event.detail;
      setCurrentUser(user);
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
    return () => window.removeEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
  }, []);

  const isAuthenticated = !!currentUser;

  return { currentUser, loading, setCurrentUser, isAuthenticated };
};