import express from "express";
import {
  smartAssignment,
  getAssignmentMetrics,
  getAssignmentHistory,
  getDashboardMetrics
} from "../controllers/assignment"

const router = express.Router();

router.post("/run", smartAssignment)
router.get("/metrics", getAssignmentMetrics)
router.get("/history", getAssignmentHistory)
router.get("/dashboard", getDashboardMetrics)

export default router
