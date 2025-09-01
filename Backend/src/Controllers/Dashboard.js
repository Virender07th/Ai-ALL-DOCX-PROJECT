import Activity from "../Models/Activity.js";
import UserStats from "../Models/UserStats.js";
import { recordActivityHelper } from "./AIController.js";

// Get recent activity
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await Activity.find({ userId })
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ success: false, message: "Failed to fetch activity" });
  }
};

// Get stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await UserStats.findOne({ userId });

    res.status(200).json({ success: true, stats: stats || {} });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

// Expose manual activity recording (optional, for testing or admin)
export const recordActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, type, status } = req.body;

    const result = await recordActivityHelper({ userId, title, type, status });

    res.status(201).json({ success: true, ...result });
  } catch (error) {
    console.error("Error recording activity:", error);
    res.status(500).json({ success: false, message: "Failed to record activity" });
  }
};
