import { lazy } from 'react';

import { AppRoute } from '../entities/AppRoute'; 

// Public routes - accessible without authentication
export const publicRoutes: AppRoute[] = [
  {
    path: '/login',
    component: lazy(() => import('../components/Login')), 
  },
  // Add other public routes here if any (e.g., /register, /forgot-password)
];

// Protected routes - accessible only after authentication
export const protectedRoutes: AppRoute[] = [
  { path: '/today', component: lazy(() => import('../components/Task/TasksToday')) },
  { path: '/task/:uuid', component: lazy(() => import('../components/Task/TaskView')) },
  { path: '/tasks', component: lazy(() => import('../components/Tasks')) },
  { path: '/inbox', component: lazy(() => import('../components/Inbox/InboxItems')) },
  { path: '/projects', component: lazy(() => import('../components/Projects')) },
  { path: '/project/:id', component: lazy(() => import('../components/Project/ProjectDetails')) },
  { path: '/areas', component: lazy(() => import('../components/Areas')) },
  { path: '/area/:id', component: lazy(() => import('../components/Area/AreaDetails')) },
  { path: '/tags', component: lazy(() => import('../components/Tags')) },
  { path: '/tag/:id', component: lazy(() => import('../components/Tag/TagDetails')) },
  { path: '/notes', component: lazy(() => import('../components/Notes')) },
  { path: '/note/:id', component: lazy(() => import('../components/Note/NoteDetails')) },
  { path: '/calendar', component: lazy(() => import('../components/Calendar')) },
  // ProfileSettings component is handled directly in AppRoutes due to specific props
  { path: '/profile', component: lazy(() => import('../components/Profile/ProfileSettings')) },
];