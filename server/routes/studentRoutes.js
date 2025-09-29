// routes/studentRoutes.js
import express from "express";
import Student from "../model/Student.js";

const router = express.Router();

// Get class-wise student strength
router.get("/class-strength", async (req, res) => {
  try {
    const strengths = await Student.aggregate([
      { $group: { _id: "$class", studentsCount: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      strengths.map((s) => ({
        id: `class-${s._id}`,
        name: `Class ${s._id}`,
        studentsCount: s.studentsCount,
      }))
    );
  } catch (err) {
    console.error("Error fetching class strength:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router; // ✅ now default export works
