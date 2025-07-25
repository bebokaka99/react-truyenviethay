// src/router/routeConfig.tsx

import React from 'react';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import ProfilePage from '../pages/profile/ProfilePage'; 
import ProtectedRoute from '../components/ProtectedRoute';
import DefaultLayout from '../layouts/DefaultLayout';
import { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  // Các route công khai (không cần đăng nhập)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  // Sử dụng DefaultLayout để bao bọc các route chính
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      // Các route được bảo vệ
      {
        element: <ProtectedRoute />, // ProtectedRoute vẫn làm nhiệm vụ bảo vệ các route này
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'profile', // Thêm route cho trang hồ sơ
            element: <ProfilePage />,
          },
          // Thêm các route khác cần bảo vệ ở đây
        ],
      },
    ],
  },
  // Route catch-all cho 404 (nếu không khớp với bất kỳ route nào trên)
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;