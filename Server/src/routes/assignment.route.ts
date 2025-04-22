import express from "express";
import {
  smartAssignment,
  getAssignmentMetrics,
} from "../controllers/assignment"

const router = express.Router();

router.post("/run", smartAssignment)
router.get("/metrics", getAssignmentMetrics)

export default router
