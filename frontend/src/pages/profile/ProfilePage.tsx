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

  // State cho avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('');
  const [removeAvatar, setRemoveAvatar] = useState<boolean>(false);

  // State cho thay đổi mật khẩu
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setCurrentAvatarUrl(currentUser.avatar || '/uploads_img/avatar/default-avatar.jpg');
      setAvatarPreview(currentUser.avatar || null);
      setRemoveAvatar(false);
    }
  }, [currentUser]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setRemoveAvatar(false);
    } else {
      setAvatarFile(null);
      setAvatarPreview(currentUser?.avatar || null);
    }
  }, [currentUser]);

  const handleRemoveAvatar = useCallback(() => {
    setAvatarFile(null);
    setAvatarPreview('/uploads_img/avatar/default-avatar.jpg');
    setRemoveAvatar(true);
  }, []);

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
      const formData = new FormData();
      formData.append('full_name', fullName);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (removeAvatar) {
        formData.append('remove_avatar', 'true');
      }

      const response = await userService.updateProfile(formData, authToken);
      setMessage(response.message || 'Cập nhật hồ sơ thành công!');
      login(authToken, response.user);
      setIsEditing(false);
      setAvatarFile(null);
    } catch (err: any) {
      console.error('Lỗi khi cập nhật hồ sơ:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  }, [fullName, avatarFile, removeAvatar, authToken, login]);

  const handleChangePassword = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordChangeMessage(null);
    setPasswordChangeError(null);
    setPasswordChangeLoading(true);

    if (!authToken) {
      setPasswordChangeError('Bạn chưa được xác thực. Vui lòng đăng nhập lại.');
      setPasswordChangeLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      setPasswordChangeLoading(false);
      return;
    }

    if (!oldPassword || !newPassword) {
      setPasswordChangeError('Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.');
      setPasswordChangeLoading(false);
      return;
    }

    try {
      const response = await userService.changePassword({ old_password: oldPassword, new_password: newPassword }, authToken);
      setPasswordChangeMessage(response.message || 'Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      setPasswordChangeError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setPasswordChangeLoading(false);
    }
  }, [oldPassword, newPassword, confirmNewPassword, authToken]);


  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);


  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang tải thông tin người dùng hoặc bạn chưa đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Thông Tin Hồ Sơ</h2>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src={currentUser.avatar || '/uploads_img/avatar/default-avatar.jpg'}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg"
              />
            </div>
            <p className="text-gray-700">
              <span className="font-semibold">Tên đăng nhập:</span>{' '}
              <span className="text-blue-600">{currentUser.username}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Họ và tên:</span>{' '}
              <span className="text-green-600">{currentUser.full_name}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{' '}
              <span className="text-green-600">{currentUser.email}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Số điện thoại:</span>{' '}
              <span className="text-green-600">{currentUser.phone}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Giới tính:</span>{' '}
              <span className="text-green-600">{currentUser.gender}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Vai trò:</span>{' '}
              <span className="text-purple-600">{currentUser.role}</span>
            </p>
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setAvatarPreview(currentUser.avatar || null);
                  setAvatarFile(null);
                  setRemoveAvatar(false);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleUpdateProfile} className="space-y-4 border-b pb-6 mb-6">
              <h3 className="text-xl font-bold text-center mb-4 text-gray-700">Chỉnh Sửa Thông Tin Cá Nhân</h3>
              <div className="flex flex-col items-center mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Ảnh đại diện:
                </label>
                <img
                  src={avatarPreview || '/uploads_img/avatar/default-avatar.jpg'}
                  alt="Avatar Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg mb-4"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {currentAvatarUrl !== '/uploads_img/avatar/default-avatar.jpg' && (
                   <button
                   type="button"
                   onClick={handleRemoveAvatar}
                   className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm focus:outline-none focus:shadow-outline"
                 >
                   Xóa ảnh đại diện
                 </button>
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                  Tên đăng nhập:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
                  value={currentUser.username}
                  disabled
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
                    if (currentUser) {
                      setFullName(currentUser.full_name || '');
                      setAvatarFile(null);
                      setAvatarPreview(currentUser.avatar || null);
                      setRemoveAvatar(false);
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

            {/* Phần thay đổi mật khẩu */}
            <form onSubmit={handleChangePassword} className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-center mb-4 text-gray-700">Đổi Mật Khẩu</h3>
              {passwordChangeMessage && <p className="text-green-500 text-center mb-4">{passwordChangeMessage}</p>}
              {passwordChangeError && <p className="text-red-500 text-center mb-4">{passwordChangeError}</p>}

              <div>
                <label htmlFor="old_password" className="block text-gray-700 text-sm font-bold mb-2">
                  Mật khẩu cũ:
                </label>
                <input
                  type="password"
                  id="old_password"
                  name="old_password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="new_password" className="block text-gray-700 text-sm font-bold mb-2">
                  Mật khẩu mới:
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm_new_password" className="block text-gray-700 text-sm font-bold mb-2">
                  Xác nhận mật khẩu mới:
                </label>
                <input
                  type="password"
                  id="confirm_new_password"
                  name="confirm_new_password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                  disabled={passwordChangeLoading}
                >
                  {passwordChangeLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;