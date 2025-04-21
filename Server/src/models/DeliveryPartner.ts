import mongoose, { Schema, Document } from 'mongoose';

export interface DeliveryPartner extends Document {
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    currentLoad: number;
    areas: string[];
    shift: {
        start: string;
        end: string;
    };
    metrics: {
        rating: number;
        completedOrders: number;
        cancelledOrders: number;
    };
}

const DeliveryPartnerSchema: Schema<DeliveryPartner> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String, 
        enum: ['active', 'inactive'],
        default: 'active'
    },
    currentLoad: {
        type: Number,
        default: 0
    },
    areas: {
        type: [String],
        default: []
    },
    shift: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    metrics: {
        rating: {
            type: Number,
            default: 0
        },
        completedOrders: {
            type: Number,
            default: 0
        },
        cancelledOrders: {
            type: Number,
            default: 0
        },
    },
}, { timestamps: true });

export default mongoose.model<DeliveryPartner>('DeliveryPartner', DeliveryPartnerSchema);