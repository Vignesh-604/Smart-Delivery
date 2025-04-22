import { Request, Response } from "express";
import Order from "../models/Order";
import ApiResponse from "../utils/ApiResponse";
import dayjs from "dayjs";
import mongoose from "mongoose";
import DeliveryPartner from "../models/DeliveryPartner";
import Assignment from "../models/Assignment";

const createOrder = async (req: Request, res: Response) => {
    try {
        const { name, phone, address, area, items = [] } = req.body;

        if (!name || !phone || !address || !area || items.length === 0) {
            return res.status(400).json(new ApiResponse(400, null, "Some fields are missing or No items in order"));
        }

        const date = dayjs().format("YYYYMMDD");
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        const orderNumber = `ORD-${date}-${random}`;

        const scheduledFor = dayjs().add(30, "minute").format("HH:mm");

        const totalAmount = items.reduce((total: number, current: { price: number, quantity: number }) => {
            return total += (current.price * current.quantity)
        }, 0)

        const order = await Order.create({
            orderNumber,
            customer: { name, phone, address },
            area,
            items,
            scheduledFor,
            totalAmount,
        });

        return res.status(201).json(new ApiResponse(201, order, "Order created"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error, "Something went wrong while creating order."));
    }
}

const toggleStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId || !mongoose.isValidObjectId(orderId)) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Incorrect or missing order ID"));
        }

        const allowedStatuses = ["picked", "delivered"];
        if (!allowedStatuses.includes(status)) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Invalid order status"));
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json(new ApiResponse(404, null, "Order not found"));
        }

        if (order.assignedTo) {
            const partner = await DeliveryPartner.findById(order.assignedTo);
            if (partner) {
                if (status === "delivered") partner.metrics.completedOrders += 1;
                if (status === "cancelled") partner.metrics.cancelledOrders += 1;
                await partner.save();
            }
        }

        return res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
    } catch (error) {
        console.error("Toggle Status Error:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Something went wrong while updating"));
    }
}

const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid order ID"));
        }

        const order = await Order.findById(id).populate("assignedTo");

        if (!order) {
            return res.status(404).json(new ApiResponse(404, null, "Order not found"));
        }

        return res.status(200).json(new ApiResponse(200, order, "Order fetched"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong"));
    }
}

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status, area, date } = req.query;

        const filter: any = {};

        if (status) filter.status = status;
        if (area) filter.area = area;

        if (date) {
            const start = new Date(`${date}T00:00:00Z`);
            const end = new Date(`${date}T23:59:59Z`);
            filter.createdAt = { $gte: start, $lte: end };
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 }).populate("assignedTo");

        if (!orders || orders.length === 0) {
            return res.status(404).json(new ApiResponse(404, [], "No orders found"));
        }

        return res.status(200).json(new ApiResponse(200, orders, "Orders fetched"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong"));
    }
}

const assignManualOrder = async (req: Request, res: Response) => {
    try {
        const { partnerId, orderId } = req.body;

        if (!mongoose.isValidObjectId(partnerId) || !mongoose.isValidObjectId(orderId)) {
            return res.status(400).json(new ApiResponse(400, null, "Something went wrong while assigning order"));
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json(new ApiResponse(400, null, "Order not found"));
        }
        if (order.status !== "pending") {
            return res.status(400).json(new ApiResponse(400, null, "Order has already been assigned"));
        }

        const partner = await DeliveryPartner.findById(partnerId);
        if (!partner) {
            return res.status(404).json(new ApiResponse(404, null, "Partner not found"));
        }

        const now = dayjs().format("HH:mm");

        const eligible =
            partner.status === "active" &&
            partner.currentLoad < 3 &&
            partner.areas.includes(order.area) &&
            partner.shift.start < now &&
            partner.shift.end > now;

        if (!eligible) {
            await Assignment.create({
                orderId, partnerId, status: "failed", reason: "Partner not eligible."
            })

            return res.status(400).json(new ApiResponse(400, null, "Assignment failed"));
        }

        order.status = "assigned";
        order.assignedTo = partnerId;
        await order.save();

        partner.currentLoad++;
        await partner.save();

        await Assignment.create({
            orderId, partnerId, status: "success"
        })

        return res.status(200).json(new ApiResponse(200, order, "Order assigned successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error, "Something went wrong while assigning order"));
    }
}

export {
    createOrder,
    toggleStatus,
    getOrderById,
    getAllOrders,
    assignManualOrder,
}