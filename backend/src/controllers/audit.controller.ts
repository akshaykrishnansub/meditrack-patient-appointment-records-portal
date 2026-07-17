import type { Request,Response } from "express"
import { getAuditLogs } from "../models/audit.model.js";

export const viewAuditLogs=async(req:Request,res:Response)=>{
    try{
        const logs=await getAuditLogs();
        res.status(200).json(logs);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}