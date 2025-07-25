// src/services/authService.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Cập nhật URL cơ sở của API

interface LoginData {
  username: string; 
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;z
  full_name: string;
  phone: string;
}

interface LoginResponse {
  message: string;
  token: string; 
  user: {
    id: string;
    username: string;
    role: string;
    full_name: string;
    // Thêm các thuộc tính user khác nếu có từ phản hồi của backend
  };
}

interface RegisterResponse {
  message: string;
  // Phản hồi đăng ký backend chỉ có message, không có token hay user
}

const login = async (data: LoginData): Promise<LoginResponse> => {
  // Cập nhật endpoint API cho đăng nhập
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/dang-nhap`, data);
  return response.data;
};

const register = async (data: RegisterData): Promise<RegisterResponse> => {
  // Cập nhật endpoint API cho đăng ký
  const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/dang-ky`, data);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;