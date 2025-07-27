// src/pages/chapter/ChapterReadingPage.tsx 

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import storyService, { Chapter, Story } from '../../services/storyService'; 

const ChapterReadingPage: React.FC = () => {
  const { storyId, chapterNumber } = useParams<{ storyId: string; chapterNumber: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [allChapters, setAllChapters] = useState<Chapter[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentChapterNum = parseInt(chapterNumber || '1');

  const fetchChapterDetails = useCallback(async () => {
    if (!storyId || isNaN(currentChapterNum)) {
      setError('ID truyện hoặc số chương không hợp lệ.');
      setLoading(false);
      return;
    }

    try {
      // Fetch story details to get story title
      const storyData: Story = await storyService.getStoryById(storyId);
      setStoryTitle(storyData.ten_truyen);

      // Fetch all chapters for navigation
      const chaptersData: Chapter[] = await storyService.getChaptersByStoryId(storyId);
      setAllChapters(chaptersData.sort((a, b) => a.so_chuong - b.so_chuong)); 

      // Fetch specific chapter content
      const fetchedChapter = await storyService.getChapterContent(storyId, currentChapterNum);
      setChapter(fetchedChapter);

    } catch (err: any) {
      setError('Không thể tải nội dung chương. Vui lòng thử lại sau.');
      console.error('Lỗi khi tải chương:', err);
    } finally {
      setLoading(false);
    }
  }, [storyId, currentChapterNum]);

  useEffect(() => {
    fetchChapterDetails();
  }, [fetchChapterDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang tải chương...</p>
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

  if (!chapter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Không tìm thấy chương này.</p>
      </div>
    );
  }

  // Lấy chỉ mục của chương hiện tại trong mảng tất cả các chương
  const currentIndex = allChapters.findIndex(c => c.so_chuong === currentChapterNum);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className="container mx-auto p-4 pt-16 bg-gray-50 min-h-screen shadow-lg">
      <nav className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:underline">Trang chủ</Link>
        <span className="mx-2">&gt;</span>
        <Link to={`/truyen/${storyId}`} className="hover:underline">{storyTitle}</Link>
        <span className="mx-2">&gt;</span>
        <span>Chương {chapter.so_chuong}</span>
      </nav>

      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">{storyTitle}</h1>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Chương {chapter.so_chuong}: {chapter.tieu_de}</h2>

      <div className="prose prose-lg mx-auto mb-10 p-6 bg-white rounded-lg shadow-md">
        {/* Render nội dung chương. Sử dụng dangerouslySetInnerHTML nếu nội dung là HTML */}
        <div dangerouslySetInnerHTML={{ __html: chapter.noi_dung }}></div>
      </div>

      <div className="flex justify-between items-center mt-8 p-4 bg-white rounded-lg shadow-md">
        {prevChapter ? (
          <Link
            to={`/truyen/${storyId}/chapter/${prevChapter.so_chuong}`}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Chương trước
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center px-6 py-3 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Chương trước
          </button>
        )}

        <Link
          to={`/truyen/${storyId}`}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full shadow-lg hover:bg-gray-300 transition duration-300"
        >
          Danh sách chương
        </Link>

        {nextChapter ? (
          <Link
            to={`/truyen/${storyId}/chapter/${nextChapter.so_chuong}`}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Chương sau
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center px-6 py-3 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed"
          >
            Chương sau
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterReadingPage;