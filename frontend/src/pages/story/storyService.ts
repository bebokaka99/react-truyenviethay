// src/services/storyService.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Đảm bảo đúng với backend của bạn

// Định nghĩa lại interface Story dựa trên backend/models/story.model.js
export interface Story {
  id: string; 
  ten_truyen: string; 
  slug: string;
  tac_gia: string; 
  mo_ta: string; 
  anh_bia: string;
  luot_xem: number; // views
  thoi_gian_cap_nhat: string; 
  user_id: string; 
  ten_tac_gia?: string; 
  trang_thai?: string; 
  trang_thai_kiem_duyet?: string; 
  // Các trường khác từ truyen_new nếu bạn cần hiển thị
  tinh_trang?: string;
  trang_thai_viet?: string;
  yeu_to_nhay_cam?: string;
  link_nguon?: string;
  muc_tieu?: string;
  doi_tuong_doc_gia?: string;
  ghi_chu_admin?: string;
  danh_gia_noi_dung?: number;
  danh_gia_van_phong?: number;
  danh_gia_sang_tao?: number;
  sample_chapter_content?: string;
}

// Định nghĩa lại interface Chapter dựa trên backend/models/chapter.model.js
export interface Chapter {
  id: string;
  truyen_id: string; 
  so_chuong: number; 
  tieu_de: string; 
  noi_dung: string; 
  slug: string;
  thoi_gian_dang: string; 
  trang_thai: string;
  is_chuong_mau: number; 
}

const storyService = {
  // Lấy danh sách truyện công khai
  getAllStories: async (): Promise<Story[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/truyen/public`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching public stories:', error);
      throw error;
    }
  },

  // Lấy chi tiết một truyện bằng ID
  getStoryById: async (storyId: string): Promise<Story> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/truyen/${storyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching story with ID ${storyId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách chương của một truyện (chúng ta đã có endpoint này ở backend)
  getChaptersByStoryId: async (storyId: string): Promise<Chapter[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chapter/truyen/${storyId}`); 
      return response.data.chapters; 
    } catch (error) {
      console.error(`Error fetching chapters for story ID ${storyId}:`, error);
      throw error;
    }
  },

  // HÀM MỚI: Lấy nội dung của một chương cụ thể
  getChapterContent: async (storyId: string, chapterNumber: number): Promise<Chapter> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chapter/${storyId}/chapter/${chapterNumber}`);
      return response.data; 
    } catch (error) {
      console.error(`Error fetching chapter ${chapterNumber} for story ${storyId}:`, error);
      throw error;
    }
  },
};

export default storyService;