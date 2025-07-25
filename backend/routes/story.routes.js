const express = require("express");
const router = express.Router();
const storyController = require("../controllers/story.controller");
const uploadStoryController = require("../controllers/up_story.controller.js");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload_story.js"); 

// Lấy tất cả truyện
router.get("/", storyController.getAllStories);
// Lấy truyện public đã duyệt (dành cho frontend)
router.get("/public", storyController.getPublicStories);

// Admin xem truyện theo userId
router.get(
  "/theo-user/:userId",
  authenticateToken,
  authorizeRoles("admin"),
  storyController.getStoriesByUserId
);

// tác giả xem truyện của mình
router.get(
  "/truyen-cua-toi",
  authenticateToken,
  authorizeRoles("author", "admin"),
  storyController.getMyStories
);

// Lấy truyện theo ID
router.get("/:id", storyController.getStoryById);

// Lấy truyện theo slug (cho frontend)
router.get("/slug/:slug", storyController.getStoryBySlug);

// Cập nhật truyện
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  storyController.updateStory
);
// Xoá truyện
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  storyController.deleteStory
);
// Lấy danh sách truyện chờ duyệt (Admin)
router.get(
  "/cho-duyet",
  authenticateToken,
  authorizeRoles("admin"),
  storyController.getPendingApproval
);

// Duyệt hoặc từ chối truyện (Admin)
router.put(
  "/:id/duyet-truyen",
  authenticateToken,
  authorizeRoles("admin"),
  storyController.approveOrRejectStory
);

// Định nghĩa route ĐĂNG TRUYỆN MỚI
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "author"),
  upload.single('anh_bia'), 
  uploadStoryController.uploadStory 
);

module.exports = router;