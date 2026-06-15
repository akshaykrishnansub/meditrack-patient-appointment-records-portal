import express from 'express'
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';

const app:Application=express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Meditrack API is running"
    })
})

export default app;