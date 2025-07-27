// src/pages/story/StoryListPage.tsx

import React, { useEffect, useState } from 'react';
import storyService, { Story } from '../../services/storyService';
import { Link } from 'react-router-dom';

const StoryListPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await storyService.getAllStories();
        setStories(data);
      } catch (err: any) {
        setError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
        console.error('Lỗi khi tải truyện:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang tải truyện...</p>
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

  return (
    <div className="container mx-auto p-4 pt-16 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        Khám Phá Truyện Hay
      </h1>
      {stories.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Không có truyện nào để hiển thị.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Link to={`/truyen/${story.id}`}>
                {/* Sử dụng story.anh_bia và đảm bảo đường dẫn đúng */}
                <img
                  src={`/uploads_img/bia_truyen/${story.anh_bia}` || '/path/to/default-cover.jpg'}
                  alt={story.ten_truyen}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <div className="p-5">
                <Link to={`/truyen/${story.id}`} className="block">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={story.ten_truyen}>
                    {story.ten_truyen}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 mb-3">Tác giả: <span className="font-medium text-blue-600">{story.tac_gia || story.ten_tac_gia || 'Đang cập nhật'}</span></p>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">{story.mo_ta}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  {/* total_chapters và views không có trực tiếp trong getPublicStories, chỉ có luot_xem */}
                  <span>Lượt xem: <span className="font-medium">{story.luot_xem}</span></span>
                </div>
                {/* Bạn có thể thêm các tag/thể loại ở đây */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryListPage;