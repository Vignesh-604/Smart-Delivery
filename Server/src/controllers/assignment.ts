import { Request, Response } from "express";
import Assignment from "../models/Assignment";
import ApiResponse from "../utils/ApiResponse";
import dayjs from "dayjs"
import Order from "../models/Order";
import DeliveryPartner from "../models/DeliveryPartner";

const smartAssignment = async (_req: Request, res: Response) => {
    try {
        const orders = await Order.find({ status: "pending" })
        if (!orders || orders.length === 0) {
            res.status(400).json(new ApiResponse(400, null, "NO pending orders"));
        }

        const now = dayjs().format("HH:mm");

        const partners = await DeliveryPartner.find({
            status: "active",
            currentLoad: { $lt: 3 },
        })

        const eligiblePartners = partners.filter((partner) => {
            const { start, end } = partner.shift;
            if (start < end) {
                return now >= start && now <= end;
            } else {
                return now >= start || now <= end;
            }
        });

        for (const order of orders) {
            const orderArea = order.area.toLowerCase().replace(/\s+/g, "");

            const eligible = eligiblePartners.filter((partner) =>
                partner.areas.some(
                    (area: string) => area.toLowerCase().replace(/\s+/g, "") === orderArea
                )
            );

            if (eligible.length === 0) continue

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

const getAssignmentMetrics = async (_req: Request, res: Response) => {
    try {
        const total = await Assignment.countDocuments();
        const totalSuccess = await Assignment.countDocuments({ status: "success" });

        const successRate = total === 0 ? 0 : ((totalSuccess / total) * 100).toFixed(2);

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

const getAssignmentHistory = async (req: Request, res: Response) => {
    try {
        const { recent } = req.query;
        const filter: any = {};

        if (recent === "true") {
            const start = dayjs().subtract(1, "day").startOf("day").toDate();
            const end = dayjs().endOf("day").toDate();
            filter.createdAt = { $gte: start, $lte: end };
        }

        const assignments = await Assignment.find(filter)
            .sort({ createdAt: -1 })
            .populate("orderId", "orderNumber area status scheduledFor")
            .populate("partnerId", "name email phone status")

        res.status(200).json(new ApiResponse(200, assignments, "Assignment history fetched"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, "Failed to fetch assignment history"));
    }
}

const getDashboardMetrics = async (_req: Request, res: Response) => {
    try {

        const activeOrders = await Order.countDocuments({ status: "assigned" });
        const totalOrders = await Order.countDocuments();
        const totalPartners = await DeliveryPartner.countDocuments();
        const activePartners = await DeliveryPartner.countDocuments({ status: "active" });

        const totalAttempts = await Assignment.countDocuments();
        const totalSuccess = await Assignment.countDocuments({ status: "success" });

        const successRate = totalAttempts === 0
            ? 0
            : ((totalSuccess / totalAttempts) * 100).toFixed(2);

        res.status(200).json(new ApiResponse(200, {
            activeOrders,
            totalOrders,
            totalPartners,
            activePartners,
            successRate: Number(successRate),
        }, "Assigned orders and metrics fetched"));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, "Failed to fetch assigned order metrics"));
    }
};

export { smartAssignment, getAssignmentMetrics, getAssignmentHistory, getDashboardMetrics }