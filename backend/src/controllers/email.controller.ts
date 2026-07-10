import type { Request,Response } from "express"
import { sendEmail } from "../services/email.service.js";

export const testMail=async(req:Request,res:Response)=>{
    try{
        await sendEmail(
            process.env.EMAIL_USER!,
            "Meditrack test email",
            "Congratulations!!! Your email service is working"
        )
        res.status(200).json({message:"Test mail sent successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Failed to send mail"});
    }
}