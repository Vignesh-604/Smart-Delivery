import { Request, Response } from "express";
import DeliveryPartner from "../models/DeliveryPartner";
import ApiResponse from "../utils/ApiResponse";
import dayjs from "dayjs"
import mongoose from "mongoose";

const registerPartner = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, areas, start, end } = req.body

        if (!name || !email || !phone || !areas || !start || !end) {
            return res.status(400).json(new ApiResponse(400, null, "Some fields are missing"));
        }

        const existing = await DeliveryPartner.findOne({ email })

        if (existing) {
            return res.status(409).json(new ApiResponse(409, null, "Partner exists"))
        }

        const partner = await DeliveryPartner.create({
            name, email, phone, areas,
            shift: { start, end }
        });

        return res.status(201).json(new ApiResponse(201, partner, "Partner registered successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error, "Something went wrong while registering"));
    }
}

const getAllPartners = async (_req: Request, res: Response) => {
    try {
        const partners = await DeliveryPartner.find();
        if (!partners || partners.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "NO partners found"));
        }

        return res.status(200).json(new ApiResponse(200, partners, "All partners fetched"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error, "Something went wrong while fetching partners"));

    }
}

const updatePartner = async (req: Request, res: Response) => {
    try {
        const {partnerId} = req.params;
        if (!partnerId || mongoose.isValidObjectId(partnerId)) {
            return res.status(400).json(new ApiResponse(400, null, "Incorrect or missing partner ID"));
        }
        const { name, email, phone, areas, start, end, status } = req.body;

        const partner = await DeliveryPartner.findById(partnerId)

        if (!partner) {
            return res.status(404).json(new ApiResponse(404, null, "Partner not found"));
        }

        if (name) partner.name = name;
        if (email) partner.email = email;
        if (phone) partner.phone = phone;
        if (areas) partner.areas = areas;
        if (start) partner.shift.start = start;
        if (end) partner.shift.end = end;
        if (status) partner.status = status;

        await partner.save();

        return res.status(200).json(new ApiResponse(200, partner, "Partner updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong while updating"));
    }
}

const deletePartner = async (req: Request, res: Response) => {
    try {
        const {partnerId} = req.params;
        if (!partnerId || !mongoose.isValidObjectId(partnerId)) {
            return res.status(400).json(new ApiResponse(400, null, "Incorrect or missing partner ID"));
        }

        await DeliveryPartner.findByIdAndDelete(partnerId);

        return res.status(200).json(new ApiResponse(200, null, "Deleted Partner"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong while deleting partners"));
        
    }
}

const findEligiblePartners = async (req: Request, res: Response) => {
    try {
        const { area } = req.query;

        if (!area) {
            return res.status(400).json(new ApiResponse(400, null, "Area is required"));
        }

        const now = dayjs().format("HH:mm");                    // current time in HH:mm format

        const partners = await DeliveryPartner.find({         // partners working that area
            status: "active",
            areas: area,
            currentLoad: { $lt: 3 }
        })

        // partners currently within their shift period
        const eligible = partners.filter(partner => { 
            return now >= partner.shift.start && now <= partner.shift.end;
        })

        if (eligible.length === 0) {
            return res.status(404).json(new ApiResponse(404, [], "No eligible partners found"));
        }

        return res.status(200).json(new ApiResponse(200, eligible, "Eligible partners fetched"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error, "Internal server error"));
    }
}

export {
    registerPartner,
    getAllPartners,
    updatePartner,
    deletePartner,
    findEligiblePartners,
}