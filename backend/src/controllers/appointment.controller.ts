import type {Request,Response} from "express";
import { createAppointment } from "../models/appointment.model.js";

interface AuthRequest extends Request{
    user?:{
        id:string,
        role:string
    }
}

//Book Appointment controller
export const bookAppointment=async(req:AuthRequest,res:Response)=>{
    try{
        const patientId=req.user!.id;
        const {doctorId,datetime}=req.body;
        const appointment=await createAppointment(patientId,doctorId,datetime);
        return res.status(201).json(appointment);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}