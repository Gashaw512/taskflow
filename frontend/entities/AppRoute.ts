import { ComponentType, LazyExoticComponent } from 'react';

export interface AppRoute {
  path: string;
  component: LazyExoticComponent<ComponentType<any>>; 
}