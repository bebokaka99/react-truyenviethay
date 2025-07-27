// backend/routes/chapter.routes.js

const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapter.controller");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
// const {
// validateCreateChapter,
// validateUpdateChapter,
// } = require("../validators/chapter.validator"); // import validator

// --- CÁC ROUTES CỤ THỂ HƠN NÊN ĐẶT LÊN ĐẦU ---

// Route để lấy nội dung chương cụ thể theo storyId và chapterNumber
// Ví dụ: GET /api/chapter/56/chapter/19
// ĐẶT CÁI NÀY LÊN TRÊN CÙNG ĐỂ NÓ ĐƯỢC KHỚP TRƯỚC
router.get("/:storyId/chapter/:chapterNumber", chapterController.getChapterContentByStoryIdAndChapterNumber);

// Lấy danh sách chương theo truyện (có phân trang)
// Ví dụ: GET /api/chapter/truyen/56
router.get("/truyen/:id", chapterController.getChaptersByStoryId);

// Lấy chi tiết 1 chương theo slug
// Ví dụ: GET /api/chapter/slug/chuong-1-cua-truyen-a
router.get("/slug/:slug", chapterController.getChapterBySlug); 

// Lấy chi tiết 1 chương theo ID
// Ví dụ: GET /api/chapter/123 (ID của chương)
// Route này chung chung hơn nên đặt sau các route cụ thể có nhiều tham số.
router.get("/:id", chapterController.getChapterById);


// --- CÁC ROUTES DÙNG METHOD KHÁC HOẶC AUTHENTICATION HOẶC CHUNG CHUNG HƠN NỮA ---

router.post(
  "/",
  authenticateToken,
  authorizeRoles("author", "admin"),
  chapterController.createChapter
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  chapterController.updateChapter
); // Cập nhật chương theo ID (chỉ admin và tác giả mới được cập nhật)

// Duyệt hoặc từ chối chương (Admin)
router.put(
  "/:id/duyet-chuong",
  authenticateToken,
  authorizeRoles("admin"),
  chapterController.approveOrRejectChapter
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  chapterController.deleteChapter
); // Xóa chương theo ID (chỉ admin và tác giả mới được xóa)

module.exports = router;