import express from 'express'
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes.js'
import testRoutes from './routes/test.routes.js'
import cookieParser from 'cookie-parser';
import appointmentRoutes from './routes/appointment.routes.js'
import medicalRecordRoutes from './routes/medicalrecord.routes.js'
import messageRoutes from './routes/message.routes.js';
import emailRoutes from './routes/email.routes.js';
const app:Application=express();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));
app.use("/api/auth",authRoutes);
app.use("/api/test",testRoutes);
app.use("/api/appointments",appointmentRoutes);
app.use("/api/records",medicalRecordRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api",emailRoutes);

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Meditrack API is running"
    })
})

export default app;