// src/pages/profile/ProfilePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const ProfilePage: React.FC = () => {
  const { currentUser, authToken, login } = useAuth(); 
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      // setUsername(currentUser.username || ''); // Không cần set state cho username
    }
  }, [currentUser]);

  const handleUpdateProfile = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    if (!authToken) {
      setError('Bạn chưa được xác thực. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        full_name: fullName,
        // Không truyền username vào đây
      };
      const response = await userService.updateProfile(updateData, authToken);
      setMessage(response.message || 'Cập nhật hồ sơ thành công!');
      
      // Cập nhật lại thông tin người dùng trong AuthContext
      // Chúng ta truyền token hiện tại và user mới từ response
      login(authToken, response.user);

      setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
    } catch (err: any) {
      console.error('Lỗi khi cập nhật hồ sơ:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  }, [fullName, authToken, login]); // Loại bỏ username khỏi dependency array

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang tải thông tin người dùng hoặc bạn chưa đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Thông Tin Hồ Sơ</h2>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!isEditing ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Tên đăng nhập:</span>{' '}
              <span className="text-blue-600">{currentUser.username}</span> {/* Vẫn hiển thị username */}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Họ và tên:</span>{' '}
              <span className="text-green-600">{currentUser.full_name}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Vai trò:</span>{' '}
              <span className="text-purple-600">{currentUser.role}</span>
            </p>
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Tên đăng nhập:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
                value={currentUser.username} // Lấy từ currentUser trực tiếp
                disabled // VÔ HIỆU HÓA TRƯỜNG NÀY
              />
            </div>
            <div>
              <label htmlFor="full_name" className="block text-gray-700 text-sm font-bold mb-2">
                Họ và tên:
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Đặt lại giá trị ban đầu nếu hủy
                  if (currentUser) {
                    setFullName(currentUser.full_name || '');
                    // setUsername(currentUser.username || ''); // Không cần set username
                  }
                  setError(null);
                  setMessage(null);
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;