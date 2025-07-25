// src/components/layout/Header.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Truyện Việt Hay
        </Link>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link to="/" className="hover:text-blue-200">
              Trang Chủ
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                {/* Ví dụ: Nút hoặc liên kết đến trang hồ sơ */}
                <Link to="/profile" className="hover:text-blue-200">
                  Chào mừng, {currentUser?.full_name || currentUser?.username}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Đăng Xuất
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-200">
                  Đăng Nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-sm">
                  Đăng Ký
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;