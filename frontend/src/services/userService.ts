// src/services/userService.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Đảm bảo đúng với backend của bạn

interface UserUpdateData {
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  avatar?: string | null; // Để gửi null khi xóa avatar
}

interface PasswordChangeData {
  old_password: string;
  new_password: string;
}

interface UserResponse {
  message: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    role: string;
    avatar?: string;
    email?: string;
    phone?: string;
    gender?: string;
    created_at?: string;
    status?: string;
    ban_until?: string | null;
  };
}

const userService = {
  updateProfile: async (data: UserUpdateData | FormData, token: string): Promise<UserResponse> => {
    try {
      let payload: UserUpdateData | FormData;
      let headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Mặc định là JSON
      };

      if (data instanceof FormData) {
        payload = data;
        delete headers['Content-Type']; 
      } else {
        payload = {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
        };
        if (Object.prototype.hasOwnProperty.call(data, 'avatar')) {
             (payload as any).avatar = data.avatar;
        }
      }

      const response = await axios.patch(`${API_BASE_URL}/user/profile`, payload, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  changePassword: async (data: PasswordChangeData, token: string): Promise<{ message: string }> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/change-password`, data, { // Endpoint PUT
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};

export default userService;