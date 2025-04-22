import { Request, Response } from "express";
import Assignment from "../models/Assignment";
import ApiResponse from "../utils/ApiResponse";
import dayjs from "dayjs"
import mongoose from "mongoose";
import Order from "../models/Order";
import DeliveryPartner from "../models/DeliveryPartner";

const smartAssignment = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ status: "pending" })
        if (!orders || orders.length === 0) {
            res.status(400).json(new ApiResponse(400, null, "NO pending orders"));
        }

        const now = dayjs().format("HH:mm");

        const partners = await DeliveryPartner.find({
            status: "active",
            currentLoad: { $lt: 3 },
            shift: {
                start: { $lt: now },
                end: { $gt: now }
            }
        })

        for (const order of orders) {
            const eligible = partners.filter(partner =>
                partner.areas.includes(order.area)
            )

            if (eligible.length === 0) continue;    // no eligible partners for this order. skip

            // first partner with least currentLoad
            const selected: any = eligible.sort((a, b) => a.currentLoad - b.currentLoad)[0];

            order.status = "assigned";
            order.assignedTo = selected._id;
            await order.save();

            selected.currentLoad++;
            await selected.save();

            await Assignment.create({
                orderId: order._id,
                partnerId: selected._id,
                status: "success"
            })
        }

        res.status(200).json(new ApiResponse(200, null, "Order assigned successfully"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, error, "Something went wrong while assigning order"));
    }
}

const getAssignmentMetrics = async (req: Request, res: Response) => {
    try {
        const total = await Assignment.countDocuments();
        const totalSuccess = await Assignment.countDocuments({ status: "success" });

        const successRate = total === 0 ? 0 : ((totalSuccess / total) * 100).toFixed(2);

        // Get failure reasons breakdown
        const failureReasons = await Assignment.aggregate([
            { $match: { status: "failed", reason: { $ne: null } } },
            {
                $group: {
                    _id: "$reason",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    reason: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                totalAssigned: totalSuccess,
                successRate: Number(successRate),
                totalAttempts: total,
                failureReasons,
            }, "Assignment metrics fetched")
        );
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, "Failed to fetch assignment metrics"));
    }
}

export { smartAssignment, getAssignmentMetrics }