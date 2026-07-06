import type {Request,Response} from 'express';
import { createMedicalRecord, deleteMedicalRecord, getMedicalRecordsByDoctorId, getMedicalRecordsByUserId } from '../models/medicalrecord.model.js';

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
        const filePath=req.file.path;
        if(!description){
            return res.status(400).json({error:"Description is required"});
        }
        const record=await createMedicalRecord(userId,filePath,description);
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