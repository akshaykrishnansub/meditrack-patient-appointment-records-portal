import nodemailer from 'nodemailer'
import { appointmentBookedTemplate } from '../templates/appointmentBooked.js';
import { appointApprovedTemplate } from '../templates/appointmentApproved.js';
import { appointmentCancelledTemplate } from '../templates/appointmentCancelled.js';
import { appointmentRescheduledTemplate } from '../templates/appointmentRescheduled.js';
import { passwordResetTemplate } from '../templates/passwordReset.js';

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
    }
})

export const sendEmail=async(to:string,subject:string,text:string)=>{
    try{
        const info=await transporter.sendMail({
            from:`"MediTrack" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        })
        console.log("Email sent",info.messageId);
    }catch(err){
        console.error("Email error",err);
    }
}

export const sendAppointmentBookedEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})
    const text=appointmentBookedTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    await sendEmail(patientEmail,"Appointment Booked Successfully",text);
}

export const sendAppointmentApprovedEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    const text=appointApprovedTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    await sendEmail(patientEmail,"Appointment Approved successfully",text);
}

export const sendAppointmentCancelledEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    const text=appointmentCancelledTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    await sendEmail(patientEmail,"Appointment Cancelled",text);
}

export const sendAppointmentRescheduledEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    const text=appointmentRescheduledTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    await sendEmail(patientEmail,"Appointment Rescheduled",text);
}

export const sendPasswordResetEmail=async(name:string,email:string,resetLink:string)=>{
    const text=passwordResetTemplate(name,resetLink);
    await sendEmail(email,"Reset Your MediTrack Password",text);
}