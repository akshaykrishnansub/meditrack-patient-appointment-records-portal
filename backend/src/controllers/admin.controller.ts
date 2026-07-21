import type { Request,Response } from "express";
import { createDoctor, deleteCancelledAppointments, deleteMedicalRecordByAdmin, deleteUser, deleteUserMedicalRecords, deleteUserMessages, findUserByEmailExceptCurrentUser, getAllMedicalRecords, getAllUsers, getDashboardStats, getMedicalRecordByAdmin, getUserById, getUserMedicalRecords, hasActiveAppointments, updateUser } from "../models/admin.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { findUserByEmail, findUserById } from "../models/auth.model.js";
import storage from "../services/storage/storage.service.js";
import bcrypt from 'bcrypt'
import { sendDoctorWelcomeEmail } from "../services/email.service.js";
import { getAllAppointments } from "../models/admin.model.js";
import { createAuditLog } from "../models/audit.model.js";

export const fetchAllUsers=async(req:Request,res:Response)=>{
    try{
        const users=await getAllUsers();
        return res.status(200).json(users);
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const removeUser=async(req:AuthRequest,res:Response)=>{
    try{
        const userId=req.params.id;
        const user=await findUserById(userId as string);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        //Prevent admin from deleting themselves
        if(req.user!.id===user.id){
            return res.status(400).json({error:"You Cannot delete your own account"});
        }

        const activeAppointmentExists=await hasActiveAppointments(userId as string);
        if(activeAppointmentExists){
            return res.status(400).json({
                error:"Cannot delete user because they have active or upcoming appointments"
            })
        }

        await deleteCancelledAppointments(userId as string);
        const medicalRecords=await getUserMedicalRecords(userId as string);
        for(const record of medicalRecords){
            console.log("Medical record:",record);
            if(!record.filePath){
                console.log("Skipping records because filePath is missing");
                continue;
            }
            await storage.delete(record.filepath);
        }

        await deleteUserMessages(userId as string);
        await deleteUserMedicalRecords(userId as string);
        await createAuditLog(req.user!.id,"DELETE_USER",`Deleted ${user.role.toLowerCase()} ${user.name} (${user.email})`)
        await deleteUser(userId as string);
        return res.status(200).json({message:"User Deleted Successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const addDoctor=async(req:AuthRequest,res:Response)=>{
    try{
        const {name,email,password}=req.body;
        if(!name?.trim()||!email?.trim()||!password?.trim()){
            return res.status(400).json({error:"Please fill the fields"});
        }
        const existingUser=await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const doctor=await createDoctor(name,email,hashedPassword);
        await createAuditLog(req.user!.id,"CREATE_DOCTOR",`Created Doctor Account for Dr. ${doctor.name} (${doctor.email})`)
        console.log("Before sendDoctorWelcomeEmail");
        await sendDoctorWelcomeEmail(name,email,password);
        return res.status(201).json({message:"Doctor created successfully",doctor});
        console.log("sendDoctorWelcomeEmail finished");
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const fetchUserById=async(req:AuthRequest,res:Response)=>{
    try{
        const userId=req.params.id;
        const user=await getUserById(userId as string);
        if(!user){
            return res.status(404).json({error:'User not found'});
        }
        return res.status(200).json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal server error'});
    }
}

export const updateExisitingUser=async(req:AuthRequest,res:Response)=>{
    try{
        const userId=req.params.id;
        const {name,email}=req.body;
        const user=await getUserById(userId as string);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        const existingEmail=await findUserByEmailExceptCurrentUser(email,userId as string);
        if(existingEmail){
            return res.status(400).json({error:"Email already exists"});
        }

        const updatedUser=await updateUser(userId as string,name,email);
        await createAuditLog(req.user!.id,"UPDATE_USER",`Updated User ${updatedUser.name} (${updatedUser.email})`)
        return res.status(200).json({message:"User updated successfully",user:updatedUser});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const fetchAllAppointments=async(req:AuthRequest,res:Response)=>{
    try{
        const appointments=await getAllAppointments();
        return res.status(200).json(appointments);

    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const viewAllMedicalRecords=async(req:AuthRequest,res:Response)=>{
    try{
        const records=await getAllMedicalRecords();
        res.status(200).json(records);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server error"});
    }
}

export const deleteMedicalRecord=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const record=await deleteMedicalRecordByAdmin(id as string);
        if(!record){
            res.status(404).json({error:"Medical Record not found"});
        }
        await storage.delete(record.filepath);
        await deleteMedicalRecordByAdmin(id as string);
        await createAuditLog(req.user!.id,"ADMIN_DELETE_MEDICAL_RECORD",`Deleted medical record "${record.description}" of patient ID "${record.userid}"`)
        res.status(200).json({message:"Medical Record Deleted Successfully"});

    }catch(err){
        console.error(err);
    }
}

export const viewMedicalRecordByAdmin=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const record=await getMedicalRecordByAdmin(id as string);
        if(!record){
            return res.status(404).json({error:"Medical record not found"});
        }
        const url=await storage.getFileUrl(record.filepath);
        return res.status(200).json({url});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const dashboardStats=async(req:AuthRequest,res:Response)=>{
    try{
        const stats=await getDashboardStats();
        return res.status(200).json(stats);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}