import type { Request,Response } from "express";
import { deleteCancelledAppointments, deleteUser, deleteUserMedicalRecords, deleteUserMessages, getAllUsers, getUserMedicalRecords, hasActiveAppointments } from "../models/admin.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { findUserById } from "../models/auth.model.js";
import storage from "../services/storage/storage.service.js";

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
        await deleteUser(userId as string);
        return res.status(200).json({message:"User Deleted Successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}