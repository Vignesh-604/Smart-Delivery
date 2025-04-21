import mongoose, { Schema, model } from "mongoose";

export interface Assignment extends Document {
    orderId: mongoose.Types.ObjectId;
    partnerId: mongoose.Types.ObjectId;
    timestamp: Date;
    status: 'success' | 'failed';
    reason?: string;
}

const AssignmentSchema: Schema<Assignment> = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
        required: true
    },
    status: {
        type: String,
        enum : ["success", "failed"],
        required: true
    },
    reason: {
        type: String,
        required: false
    }
}, { timestamps: true });

export default model<Assignment>("Assignment", AssignmentSchema);