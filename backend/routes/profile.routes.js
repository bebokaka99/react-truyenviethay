// backend/routes/profile.routes.js

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const authController = require("../controllers/auth.controller");
const uploadAvatar = require("../middleware/upload_avatar"); 

// Route để cập nhật thông tin hồ sơ của người dùng hiện tại
router.patch(
  "/profile",
  authenticateToken,
  uploadAvatar.single("avatar"), 
  authController.updateMe
);

router.get("/profile", authenticateToken, authController.getMe);

router.put(
  "/change-password",
  authenticateToken,
  authController.changePassword
);

module.exports = router;