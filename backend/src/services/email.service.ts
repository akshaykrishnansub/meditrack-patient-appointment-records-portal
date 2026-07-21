import nodemailer from 'nodemailer'
import { appointmentBookedTemplate } from '../templates/appointmentBooked.js';
import { appointApprovedTemplate } from '../templates/appointmentApproved.js';
import { appointmentCancelledTemplate } from '../templates/appointmentCancelled.js';
import { appointmentRescheduledTemplate } from '../templates/appointmentRescheduled.js';
import { passwordResetTemplate } from '../templates/passwordReset.js';
import mailGenerator from '../utils/mailGenerator.js';
import { doctorWelcomeTemplate } from '../templates/doctorWelcome.js';

console.log("Attempting to send email...");
const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
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
        console.log("2. sendMail completed");
        console.log(info.messageId);
    }catch(err){
        console.error("3. Send Email Failed",err);
        throw err;
    }finally{
        console.log("4. Send Email finished")
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
    const mail=passwordResetTemplate(name,resetLink);
    const html=mailGenerator.generate(mail);
    await sendEmail(email,"Reset Your MediTrack Password",html);
}

export const sendDoctorWelcomeEmail=async(name:string,email:string,password:string)=>{
    const mail=doctorWelcomeTemplate(name,email,password);
    const html=mailGenerator.generate(mail);
    await sendEmail(email,"Welcome to MediTrack-Doctor Account",html)
}