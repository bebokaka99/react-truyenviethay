// src/services/userService.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; 

interface UserUpdateData {
  full_name?: string;
}

interface UserResponse {
  message: string;
  user: {
    id: string;
    username: string; 
    full_name: string;
    role: string;
  };
}

const userService = {
  updateProfile: async (data: UserUpdateData, token: string): Promise<UserResponse> => {
    try {
      const payload: UserUpdateData = {
        full_name: data.full_name,
        // Không thêm username vào payload
      };

      const response = await axios.patch(`${API_BASE_URL}/user/profile`, payload, { // Điều chỉnh endpoint nếu backend của bạn khác
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  // Các hàm khác liên quan đến user nếu cần
};

export default userService;