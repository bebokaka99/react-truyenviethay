// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    // Nếu đã đăng nhập nhưng không có quyền, chuyển hướng về trang không có quyền truy cập
    return <Navigate to="/404" replace />; 
  }
    // Nếu đã đăng nhập và có quyền, hiển thị nội dung của route
  return <Outlet />;
};

export default ProtectedRoute;