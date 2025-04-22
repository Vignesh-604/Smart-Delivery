import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({path: "./env"});
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))

mongoose.connect(process.env.MONGODB_URI || '')
    .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
    .catch(err => console.error(err));


// Routes
import partnerRouter from "./routes/deliveryPartner.route";
import orderRouter from "./routes/order.route";
import assignmentRouter from "./routes/assignment.route";

app.use("/api/partners", partnerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/assignments", assignmentRouter);