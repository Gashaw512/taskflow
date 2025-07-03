import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth'; 
import { useDarkMode } from './useDarkMode'; 

interface AppInitializationHook {
  isInitialized: boolean;
  isAuthenticated: boolean;
  currentUser: any | null; 
  setCurrentUser: (user: any | null) => void; 
  toggleDarkMode: () => void;
}

export const useAppInitialization = (): AppInitializationHook => {
  const { i18n } = useTranslation(); 
  const { currentUser, loading: authLoading, setCurrentUser, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode(); 

  const isInitialized = i18n.isInitialized && !authLoading;

  return {
    isInitialized,
    isAuthenticated,
    currentUser,
    setCurrentUser,
    isDarkMode, 
    toggleDarkMode,
  };
};