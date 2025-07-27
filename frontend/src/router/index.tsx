// src/router/index.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import HomePage from '../pages/home/HomePage';
import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute'; 
import StoryListPage from '../pages/story/StoryListPage';
import StoryDetailPage from '../pages/story/StoryDetailPage';
import ChapterReadingPage from '../pages/chapter/ChapterReadingPage'; 

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Public Routes for Stories */}
          <Route path="/truyen" element={<StoryListPage />} /> {/* Trang danh sách truyện */}
          <Route path="/truyen/:storyId" element={<StoryDetailPage />} /> {/* Trang chi tiết truyện */}
          {/* Route cho trang đọc chương vẫn giữ nguyên */}
          <Route path="/truyen/:storyId/chapter/:chapterNumber" element={<ChapterReadingPage />} /> 

          {/* Private Routes (nay là ProtectedRoute) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            {/* Thêm các route cần xác thực khác vào đây */}
          </Route>

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;