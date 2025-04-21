import mongoose, { Schema, model } from "mongoose";

export interface Order extends Document {
    orderNumber: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    area: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    status: 'pending' | 'assigned' | 'picked' | 'delivered';
    scheduledFor: string;  
    assignedTo?: mongoose.Types.ObjectId;   
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema<Order> = new Schema({
    orderNumber: {
        type: String,
        required: true
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
    },
    area: {
        type: String,
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    status: {
        type: String,
        enum: ['pending', 'assigned', 'picked', 'delivered'],
        required: true,
    },
    scheduledFor: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner"
    },
    totalAmount: Number,
}, { timestamps: true });

export default model<Order>("Order", OrderSchema);