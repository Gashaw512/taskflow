import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAppInitialization } from '../../hooks/useAppInitialization'; 

import FallbackLoading from '../Shared/FallbackLoading'; 
import NotFound from '../Shared/NotFound'; 

import Layout from '../../Layout'; 
import ProfileSettings from '../Profile/ProfileSettings'; 

import { publicRoutes, protectedRoutes } from '../../routes/routes'; // Path relative to its location

const AppRoutes: React.FC = () => {
  const { 
    isAuthenticated, 
    currentUser, 
    setCurrentUser, 
    isDarkMode, 
    toggleDarkMode 
  } = useAppInitialization();

  return (
    <Suspense fallback={<FallbackLoading />}>
      <Routes>
        {isAuthenticated ? (
          // *** Authenticated Routes ***
          <Route
            element={
              <Layout
                currentUser={currentUser!}
                setCurrentUser={setCurrentUser}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              >
                <Outlet />
              </Layout>
            }
          >
            <Route index element={<Navigate to="/today" replace />} />
            
            {protectedRoutes
              .filter(route => route.path !== '/profile') 
              .map((route) => (
                <Route 
                  key={route.path} 
                  path={route.path} 
                  element={<route.component />} 
                />
              ))}
            
            <Route 
              path="/profile" 
              element={<ProfileSettings 
                currentUser={currentUser!} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode} 
              />} 
            />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          // *** Unauthenticated Routes ***
          <>
            {publicRoutes.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;