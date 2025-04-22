import express from "express";
import {
    createOrder,
    toggleStatus,
    getOrderById,
    getAllOrders,
    assignManualOrder,
} from "../controllers/order";

const router = express.Router();

router.post("/", createOrder)
router.get("/", getAllOrders)
router.get("/:id", getOrderById)
router.put("/:orderId/status", toggleStatus)
router.post("/assign", assignManualOrder)

export default router
