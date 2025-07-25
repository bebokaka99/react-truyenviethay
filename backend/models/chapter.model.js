const db = require("../config/db");

const ChapterModel = {
  createChapter: async ({ truyen_id, so_chuong, tieu_de, noi_dung, slug }) => {
    const thoi_gian_dang = new Date();
    const [result] = await db.execute(
      `INSERT INTO chuong (
        truyen_id, so_chuong, tieu_de, noi_dung, slug,
        thoi_gian_dang, trang_thai, is_chuong_mau
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        truyen_id,
        so_chuong,
        tieu_de,
        noi_dung, // <-- Sử dụng cột noi_dung cho chương bình thường
        slug,
        thoi_gian_dang,
        "cho_duyet", 
        0, 
      ]
    );
    return { chapter_id: result.insertId };
  },

  getChaptersByStoryId: async (truyen_id, limit, offset) => {
    let query = `SELECT * FROM chuong WHERE truyen_id = ? AND trang_thai = 'duyet' ORDER BY so_chuong ASC`;
    const params = [truyen_id];

    // Chỉ thêm LIMIT và OFFSET nếu chúng được cung cấp
    if (limit !== undefined && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }
    
    const [rows] = await db.execute(query, params);
    return rows;
  },

  getChapterById: async (chapter_id) => {
    const [rows] = await db.execute(`SELECT * FROM chuong WHERE id = ?`, [
      chapter_id,
    ]);
    return rows[0];
  },

  getChapterBySlug: async (slug) => {
    const [rows] = await db.execute(
      "SELECT * FROM chuong WHERE slug = ? LIMIT 1",
      [slug]
    );
    return rows[0];
  },

  updateChapter: async (id, { tieu_de, noi_dung, so_chuong, slug }) => {
    const [result] = await db.execute(
      `UPDATE chuong 
        SET tieu_de = ?, noi_dung = ?, so_chuong = ?, slug = ? 
        WHERE id = ?`,
      [tieu_de, noi_dung, so_chuong, slug, id]
    );
    return result.affectedRows;
  },

  deleteChapter: async (id) => {
    const [result] = await db.execute(`DELETE FROM chuong WHERE id = ?`, [id]);
    return result.affectedRows;
  },

  createSampleChapter: async (chapterData) => {
    await db.query(
      `INSERT INTO chuong (
        truyen_id, so_chuong, tieu_de, noi_dung_chuong_mau,
        thoi_gian_dang, trang_thai, is_chuong_mau
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        chapterData.truyen_id,
        0, // Chương mẫu thường có số chương là 0 hoặc một giá trị đặc biệt
        "Chương mẫu",
        chapterData.noi_dung, // <-- Đảm bảo đây là dữ liệu nội dung từ frontend và nó sẽ được lưu vào noi_dung_chuong_mau
        chapterData.thoi_gian_dang,
        "chuong_mau", // Trạng thái đặc biệt cho chương mẫu
        1, // Đánh dấu đây là chương mẫu
      ]
    );
  },
  getChapterByStoryIdAndChapterNumber: async (storyId, chapterNumber) => {
    try {
      const [rows] = await db.query(
        `SELECT * FROM chuong 
         WHERE truyen_id = ? AND so_chuong = ? AND trang_thai = 'da_duyet'`, 
        [storyId, chapterNumber]
      );
      return rows[0]; 
    } catch (error) {
      console.error("Error fetching chapter by story ID and chapter number:", error);
      throw error;
    }
  },
};

module.exports = ChapterModel;