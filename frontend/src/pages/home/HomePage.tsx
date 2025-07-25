// src/pages/home/HomePage.tsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Chào mừng đến với Trang Chủ!</h1>
      {isAuthenticated && currentUser ? (
        <div className="text-lg text-gray-700 text-center">
          <p>Bạn đã đăng nhập với tên đăng nhập: <span className="font-semibold text-blue-600">{currentUser.username}</span></p>
          <p>Vai trò: <span className="font-semibold text-purple-600">{currentUser.role}</span></p>
          <p>Họ và tên: <span className="font-semibold text-green-600">{currentUser.full_name}</span></p>
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Đăng Xuất
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-700">Bạn chưa đăng nhập. Vui lòng <a href="/login" className="text-blue-500 hover:text-blue-800">Đăng nhập</a> để tiếp tục.</p>
      )}
    </div>
  );
};

export default HomePage;