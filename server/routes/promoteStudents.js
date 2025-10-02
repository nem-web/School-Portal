// routes/admin.js (example)

import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Promote all students (increase class by 1)
router.put("/promote-students", async (req, res) => {
  try {
    // Increase class by 1 for all students
    const result = await Student.updateMany(
      { class: { $lt: 12 } },  // only promote students below class 12
      { $inc: { class: 1 } }   // increment class by 1
    );

    // Optional: Handle class 12 students (e.g., mark as "Graduated")
    await Student.updateMany(
      { class: 12 },
      { $set: { status: "Graduated" } }
    );

    res.status(200).json({
      message: "All students promoted successfully",
      result
    });
  } catch (err) {
    console.error("Promotion error:", err);
    res.status(500).json({ error: "Failed to promote students" });
  }
});

export default router;
