// src/services/storyService.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Đảm bảo đúng với backend của bạn

// Định nghĩa lại interface Story dựa trên backend/models/story.model.js
export interface Story {
  id: string; // id
  ten_truyen: string; // title
  slug: string;
  tac_gia: string; // author (có thể là username của user_id hoặc tên riêng)
  mo_ta: string; // description
  anh_bia: string; // cover_image (path to image)
  luot_xem: number; // views
  thoi_gian_cap_nhat: string; // updated_at (string date)
  user_id: string; // ID của tác giả đăng truyện
  ten_tac_gia?: string; // Tên tác giả lấy từ join bảng users (nếu có)
  trang_thai?: string; // Ví dụ: 'ongoing', 'completed'
  trang_thai_kiem_duyet?: string; // 'cho_duyet', 'duyet', 'tu_choi'
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
  sample_chapter_content?: string; // Từ getById
}

// Định nghĩa lại interface Chapter dựa trên backend/models/chapter.model.js
export interface Chapter {
  id: string;
  truyen_id: string; // story_id
  so_chuong: number; // chapter_number
  tieu_de: string; // title
  noi_dung: string; // content (nội dung chương)
  slug: string;
  thoi_gian_dang: string; // created_at
  trang_thai: string;
  is_chuong_mau: number; // 0 hoặc 1
}

const storyService = {
  // Lấy danh sách truyện công khai
  getAllStories: async (): Promise<Story[]> => {
    try {
      // Dùng endpoint '/public' để lấy danh sách truyện đã duyệt
      const response = await axios.get(`${API_BASE_URL}/truyen/public`);
      // Backend trả về { data: [...], pagination: {...} }
      return response.data.data; // Lấy mảng truyện từ thuộc tính 'data'
    } catch (error) {
      console.error('Error fetching public stories:', error);
      throw error;
    }
  },

  // Lấy chi tiết một truyện bằng ID
  getStoryById: async (storyId: string): Promise<Story> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/truyen/${storyId}`); // Endpoint của bạn
      return response.data; // Backend trả về trực tiếp object story
    } catch (error) {
      console.error(`Error fetching story with ID ${storyId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách chương của một truyện
  // VÌ HIỆN TẠI CHƯA CÓ ENDPOINT NÀY Ở BACKEND, CHÚNG TA SẼ BÁO LỖI HOẶC TRẢ VỀ MẢNG RỖNG NẾU GỌI
  // CHÚNG TA CẦN THÊM ENDPOINT NÀY SAU!
  getChaptersByStoryId: async (storyId: string): Promise<Chapter[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/truyen/${storyId}/chapters`);
      return response.data.chapters; 
    } catch (error) {
      console.error(`Error fetching chapters for story ID ${storyId}:`, error);
      throw error; 
    }
  },
  getChapterContent: async (storyId: string, chapterNumber: number): Promise<Chapter> => {
    try {
      // THAY ĐỔI DÒNG NÀY ĐỂ SỬ DỤNG "/chuong" thay vì "/chapter"
      const response = await axios.get(`${API_BASE_URL}/chuong/${storyId}/chapter/${chapterNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chapter ${chapterNumber} for story ${storyId}:`, error);
      throw error;
    }
  },
};

export default storyService;