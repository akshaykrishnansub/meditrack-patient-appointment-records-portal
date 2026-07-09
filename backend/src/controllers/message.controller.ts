import type { Request,Response } from "express";
import { getDoctorConversations, getMessages, getPatientConversations } from "../models/message.model.js";

//Displays the conversation list in the sidebar
export const getConversationList=async(req:Request,res:Response)=>{
    try{
        const user=(req as any).user;
        if(user.role==="PATIENT"){
            const conversations=await getPatientConversations(user.id);
            return res.status(200).json({conversations});
        }
        if(user.role==="DOCTOR"){
            const conversations=await getDoctorConversations(user.id);
            return res.status(200).json({conversations});
        }
        return res.status(403).json({error:"Unauthorized"});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

//Messages sent or received
export const getChatMessages=async(req:Request,res:Response)=>{
    try{
        const user=(req as any).user;
        const otherUserId=req.params.userId;
        const messages=await getMessages(user.id,otherUserId as string);
        return res.status(200).json({messages});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
}