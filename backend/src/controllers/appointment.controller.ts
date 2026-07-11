import type {Request,Response} from "express";
import { createAppointment, getAllAppointments, getAppointmentsByDoctorId, rescheduleAppointment, updateStatus, checkDoctorAvailability, getPatientAppointmentWithDoctorName, getAppointmentEmailData} from "../models/appointment.model.js";
import { sendAppointmentApprovedEmail, sendAppointmentBookedEmail, sendAppointmentCancelledEmail } from "../services/email.service.js";

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

        //checking doctor availability
        const available=await checkDoctorAvailability(doctorId,datetime);
        if(!available){
            return res.status(409).json({error:'Doctor Not available at this time'});
        }
        const appointment=await createAppointment(patientId,doctorId,datetime);
        const emailData=await getAppointmentEmailData(appointment.id);
        await sendAppointmentBookedEmail(emailData.patient_name,emailData.patient_email,emailData.doctor_name,emailData.datetime);
        return res.status(201).json(appointment);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

//GET Appointments(RBAC)
export const getAppointments=async(req:AuthRequest,res:Response)=>{
    try{
        const {id,role}=req.user!;
        let data;
        if(role==="PATIENT"){
            data=await getPatientAppointmentWithDoctorName(id);
        }else if(role==="DOCTOR"){
            data=await getAppointmentsByDoctorId(id);
        }else{
            data=await getAllAppointments();
        }
        return res.json(data);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

//Approve appointment
export const approveAppointment=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const updated=await updateStatus(id as string,"APPROVED");
        const emailData=await getAppointmentEmailData(id as string);
        await sendAppointmentApprovedEmail(emailData.patient_name,emailData.patient_email,emailData.doctor_name,emailData.datetime);
        return res.json(updated);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

//Cancel appointment
export const cancelAppointment=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const updated=await updateStatus(id as string,"CANCELLED");
        const emailData=await getAppointmentEmailData(id as string);
        await sendAppointmentCancelledEmail(emailData.patient_name,emailData.patient_email,emailData.doctor_name,emailData.datetime);
        return res.json(updated);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

//Reschedule
export const reschedule=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const {datetime}=req.body;
        const updated=await rescheduleAppointment(id as string,datetime);
        return res.json(updated);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}