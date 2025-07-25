// backend/services/notification.service.js
const db = require("../config/db");
const storyModel = require("../models/story.model");

// Hàm gửi thông báo chung cho user
const sendNotification = async (user_id, content, story_id = null, link = null) => {
  try {
    const query = `
      INSERT INTO thong_bao (user_id, content, truyen_id, link, status)
      VALUES (?, ?, ?, ?, 'unread')
    `;
    await db.query(query, [user_id, content, story_id, link]); // Thêm cột link vào đây
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error("Có lỗi xảy ra khi gửi thông báo.");
  }
};

// Gửi thông báo cho người theo dõi khi có chương mới hoặc bị từ chối
const notifyFollowersAboutChapterUpdate = async (
  storyId,
  tenTruyen,
  action
) => {
  try {
    const followers = await storyModel.getFollowers(storyId);
    const content =
      action === "duyet"
        ? `${tenTruyen} đã có chương mới.`
        : `Chương mới trong truyện ${tenTruyen} đã bị từ chối.`;

    await Promise.all(
      followers.map((follower) =>
        sendNotification(follower.user_id, content, storyId)
      )
    );
  } catch (error) {
    console.error("Error notifying followers:", error);
    throw new Error("Có lỗi xảy ra khi thông báo cho người theo dõi.");
  }
};

// Gửi thông báo cho tác giả khi truyện được duyệt hoặc từ chối
const notifyAuthorAboutStoryApproval = async (
  userId,
  storyId,
  tenTruyen,
  action
) => {
  try {
    const message =
      action === "duyet"
        ? `Truyện "${tenTruyen}" của bạn đã được duyệt.`
        : `Truyện "${tenTruyen}" của bạn đã bị từ chối.`;

    await sendNotification(userId, message, storyId);
  } catch (error) {
    console.error("Error notifying author:", error);
    throw new Error("Có lỗi xảy ra khi gửi thông báo cho tác giả.");
  }
};

// Hàm mới: Lấy danh sách ID của tất cả các admin
const getAdminUserIds = async () => {
  try {
    const [rows] = await db.query(
      `SELECT id FROM users_new WHERE role = 'admin'`
    ); // Giả định bảng user của bạn là users_new và có cột role
    return rows.map((row) => row.id);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách admin:", error);
    return [];
  }
};

// Hàm mới: Gửi thông báo đến tất cả admin
const sendNotificationToAdmins = async (message, link) => {
  const adminIds = await getAdminUserIds();
  if (adminIds.length === 0) {
    console.log("Không tìm thấy admin nào để gửi thông báo.");
    return;
  }

  for (const adminId of adminIds) {
    await sendNotification(adminId, message, null, link); // Gửi thông báo cho admin, story_id có thể là null nếu thông báo không gắn với truyện cụ thể
  }
  console.log(`Đã gửi thông báo cho ${adminIds.length} admin về truyện mới.`);
};

module.exports = {
  sendNotification,
  notifyFollowersAboutChapterUpdate,
  notifyAuthorAboutStoryApproval,
  sendNotificationToAdmins, // Thêm hàm mới vào export
};