import type {Request,Response} from 'express';
import { createMedicalRecord, deleteMedicalRecord, getMedicalRecordById, getMedicalRecordsByDoctorId, getMedicalRecordsByUserId, isDoctorAssignedToPatient } from '../models/medicalrecord.model.js';
import storage from '../services/storage/storage.service.js';
import { createAuditLog } from '../models/audit.model.js';

interface AuthRequest extends Request{
    user?:{
        id:string;
        role:string;
    }
}

export const uploadMedicalRecord=async(req:AuthRequest,res:Response)=>{
    try{
        const userId=req.user!.id
        const description=req.body.description;
        if(!req.file){
            return res.status(400).json({error:'Please upload a file'});
        }
        const filePath=await storage.upload(req.file);
        if(!description){
            return res.status(400).json({error:"Description is required"});
        }
        const record=await createMedicalRecord(userId,filePath,description);
        await createAuditLog(userId,"UPLOADED_MEDICAL_RECORD",`Medical record with description "${description}"`)
        return res.status(201).json(record);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const getMedicalRecords=async(req:AuthRequest,res:Response)=>{
    try{
        const userId=req.user!.id;
        const records=await getMedicalRecordsByUserId(userId);
        return res.json(records);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const removeMedicalRecord=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const deleted=await deleteMedicalRecord(id as string);
        if(!deleted){
            return res.status(404).json({error:"Medical record not found"});
        }
        await storage.delete(deleted.filepath);
        await createAuditLog(req.user!.id,"DELETE_MEDICAL_RECORD",`Deleted Medical Record "${deleted.description}"`)
        return res.json(deleted);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const getDoctorMedicalRecords=async(req:AuthRequest,res:Response)=>{
    try{
        const doctorId=req.user!.id;
        const records=await getMedicalRecordsByDoctorId(doctorId);
        return res.json(records);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const viewMedicalRecord=async(req:AuthRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const record=await getMedicalRecordById(id as string);
        if(!record){
            return res.status(404).json({error:'Medical record not found'});
        }

        //Patient can view their 
        if(req.user?.role==="PATIENT"){
            if(record.userid!==req.user.id){
                return res.status(403).json({error:"Access Denied"});
            }
        }

        if(req.user?.role==="DOCTOR"){
            const assigned=await isDoctorAssignedToPatient(req.user.id,record.userid);
            if(!assigned){
                return res.status(403).json({error:"Access denied"});
            }
        }

        const url=await storage.getFileUrl(record.filepath);
        return res.json({url});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Something went wrong"});
    }
}