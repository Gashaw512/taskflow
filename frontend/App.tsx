import React from 'react';
import { useAppInitialization } from './hooks/useAppInitialization'; 
import LoadingScreen from './components/Shared/LoadingScreen'; 
import AppRoutes from './components/App/AppRoutes'; 

const App: React.FC = () => {
  const { isInitialized } = useAppInitialization(); 

  if (!isInitialized) {
    return <LoadingScreen />; 
  }

  return <AppRoutes />;
};

export default App;