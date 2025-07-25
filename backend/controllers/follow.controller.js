// controllers/follow.controller.js

const followService = require("../services/follow.sevices");

// Lấy danh sách truyện theo dõi
exports.getFollowList = async (req, res) => {
  const userId = req.user.id; 
  const page = parseInt(req.query.page) || 1;

  try {
    const result = await followService.getFollowedStories(userId, page, 10);
    res.json({
      success: true,
      data: result.stories,
      totalFollowed: result.totalCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách truyện theo dõi",
    });
  }
};

// Toggle theo dõi (thêm hoặc bỏ theo dõi)
exports.toggleFollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const truyenId = parseInt(req.params.truyenId); 

    if (!truyenId)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu truyenId" });

    const result = await followService.toggleFollow(userId, truyenId);

    res.json(result);
  } catch (err) {
    console.error("Toggle follow error:", err);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra!" });
  }
};
