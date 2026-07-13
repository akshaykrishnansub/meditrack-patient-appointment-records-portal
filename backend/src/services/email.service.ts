import nodemailer from 'nodemailer'
import { appointmentBookedTemplate } from '../templates/appointmentBooked.js';
import { appointApprovedTemplate } from '../templates/appointmentApproved.js';
import { appointmentCancelledTemplate } from '../templates/appointmentCancelled.js';
import { appointmentRescheduledTemplate } from '../templates/appointmentRescheduled.js';
import { passwordResetTemplate } from '../templates/passwordReset.js';
import mailGenerator from '../utils/mailGenerator.js';

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

export const sendEmail=async(to:string,subject:string,html:string)=>{
    try{
        const info=await transporter.sendMail({
            from:`"MediTrack" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        })
        console.log("Email sent",info.messageId);
    }catch(err){
        console.error("Email error",err);
    }
}

export const sendAppointmentBookedEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})
    const email=appointmentBookedTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    const html=mailGenerator.generate(email);
    await sendEmail(patientEmail,"Appointment Booked Successfully",html);
}

export const sendAppointmentApprovedEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    const email=appointApprovedTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    const html=mailGenerator.generate(email)
    await sendEmail(patientEmail,"Appointment Approved successfully",html);
}

export const sendAppointmentCancelledEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    const email=appointmentCancelledTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    const html=mailGenerator.generate(email);
    await sendEmail(patientEmail,"Appointment Cancelled",html);
}

export const sendAppointmentRescheduledEmail=async(patientName:string,patientEmail:string,doctorName:string,datetime:string)=>{
    const appointmentDate=new Date(datetime).toLocaleDateString();
    const appointmentTime=new Date(datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    const email=appointmentRescheduledTemplate(patientName,doctorName,appointmentDate,appointmentTime);
    const html=mailGenerator.generate(email)
    await sendEmail(patientEmail,"Appointment Rescheduled",html);
}

export const sendPasswordResetEmail=async(name:string,email:string,resetLink:string)=>{
    const text=passwordResetTemplate(name,resetLink);
    await sendEmail(email,"Reset Your MediTrack Password",text);
}