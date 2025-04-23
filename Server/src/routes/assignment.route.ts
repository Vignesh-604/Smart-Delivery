import express from "express";
import {
  smartAssignment,
  getAssignmentMetrics,
  getAssignmentHistory
} from "../controllers/assignment"

const router = express.Router();

router.post("/run", smartAssignment)
router.get("/metrics", getAssignmentMetrics)
router.get("/history", getAssignmentHistory)

export default router
