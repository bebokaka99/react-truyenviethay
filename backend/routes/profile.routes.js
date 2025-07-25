// backend/routes/profile.routes.js

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const authController = require("../controllers/auth.controller"); 
const uploadAvatar = require("../middleware/upload_avatar");

// Đã thay đổi từ /me sang /profile
router.patch(
  "/profile",
  authenticateToken,
  uploadAvatar.single("avatar"), 
  authController.updateMe 
);

// Đã thay đổi từ /me sang /profile
router.get("/profile", authenticateToken, authController.getMe);

router.put(
  "/change-password",
  authenticateToken,
  authController.changePassword
);

module.exports = router;