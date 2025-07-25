// src/router/routeConfig.ts

import React from 'react';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];

export default routes;