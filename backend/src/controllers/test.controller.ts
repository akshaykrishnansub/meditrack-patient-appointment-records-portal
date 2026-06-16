import type{ Request,Response } from "express"

export const patientDashboard=(req:Request,res:Response)=>{
    return res.json({message:"Patient Access Granted"})
}

export const doctorDashboard=(req:Request,res:Response)=>{
    return res.json({message:"Doctor Access Granted"})
}

export const adminDashboard=(req:Request,res:Response)=>{
    return res.json({message:"Admin Access Granted"})
}