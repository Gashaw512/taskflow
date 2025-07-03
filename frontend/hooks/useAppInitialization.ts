
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth'; 
import { useDarkMode } from './useDarkMode'; 
import { User } from '../entities/User'; 
interface AppInitializationHook {
  isInitialized: boolean;
  isAuthenticated: boolean;
  currentUser: User | null; 
  setCurrentUser: (user: User | null) => void; 
  isDarkMode: boolean; 
  toggleDarkMode: () => void; 
}

export const useAppInitialization = (): AppInitializationHook => {
  const { i18n } = useTranslation(); 
  const { currentUser, loading: authLoading, setCurrentUser, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode(); 

  // The application is considered initialized when i18n is ready and auth loading is complete
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