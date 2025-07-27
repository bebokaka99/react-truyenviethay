// src/pages/story/StoryDetailPage.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import storyService, { Story, Chapter } from '../../services/storyService';

const StoryDetailPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStoryDetails = useCallback(async () => {
    if (!storyId) {
      setError('ID truyện không hợp lệ.');
      setLoading(false);
      return;
    }
    try {
      const fetchedStory = await storyService.getStoryById(storyId);
      setStory(fetchedStory);

      // Tạm thời bỏ qua việc lấy chương cho đến khi backend có endpoint
      // const fetchedChapters = await storyService.getChaptersByStoryId(storyId);
      // setChapters(fetchedChapters);

    } catch (err: any) {
      setError('Không thể tải chi tiết truyện. Vui lòng thử lại sau.');
      console.error('Lỗi khi tải chi tiết truyện:', err);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    fetchStoryDetails();
  }, [fetchStoryDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang tải chi tiết truyện...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Không tìm thấy truyện này.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-16 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <img
            src={`/uploads_img/bia_truyen/${story.anh_bia}` || '/path/to/default-cover.jpg'}
            alt={story.ten_truyen}
            className="w-48 h-64 object-cover rounded-lg shadow-md mb-6 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="flex-grow">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{story.ten_truyen}</h1>
            <p className="text-lg text-gray-700 mb-2">Tác giả: <span className="font-semibold text-blue-600">{story.tac_gia || story.ten_tac_gia || 'Đang cập nhật'}</span></p>
            <p className="text-md text-gray-600 mb-4">Trạng thái: <span className="font-medium text-green-700">{story.trang_thai === 'hoan_thanh' ? 'Hoàn thành' : story.trang_thai === 'dang_ra' ? 'Đang ra' : 'Tạm dừng'}</span></p>
            <p className="text-gray-800 leading-relaxed mb-4">{story.mo_ta}</p>
            <div className="flex items-center space-x-6 text-gray-700 text-sm">
              <span><span className="font-semibold">Lượt xem:</span> {story.luot_xem}</span>
              {/* average rating và total chapters không có trực tiếp từ getById của bạn, nếu cần phải tính toán hoặc thêm vào backend */}
            </div>
            {/* Nút Đọc ngay / Thêm vào tủ sách / Theo dõi có thể thêm vào đây */}
            <div className="mt-6 flex space-x-4">
              {/* Tạm thời bỏ nút đọc ngay cho đến khi có danh sách chương */}
              {/* <Link to={`/truyen/${story.id}/chapter/${chapters[0]?.so_chuong || 1}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                Đọc Ngay
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách chương - Hiện tại sẽ trống vì chưa có endpoint backend */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Danh Sách Chương</h2>
        {chapters.length === 0 ? (
          <p className="text-gray-600">Truyện này chưa có chương nào hoặc đang tải. (Cần endpoint backend để lấy chương)</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {chapters
              .sort((a, b) => a.so_chuong - b.so_chuong) // Sắp xếp theo số chương
              .map((chapter) => (
              <li key={chapter.id} className="py-3 flex justify-between items-center hover:bg-gray-50 transition duration-150 ease-in-out">
                <Link to={`/truyen/${story.id}/chapter/${chapter.so_chuong}`} className="text-lg text-blue-700 hover:text-blue-900 font-medium">
                  Chương {chapter.so_chuong}: {chapter.tieu_de}
                </Link>
                <span className="text-sm text-gray-500">{new Date(chapter.thoi_gian_dang).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StoryDetailPage;