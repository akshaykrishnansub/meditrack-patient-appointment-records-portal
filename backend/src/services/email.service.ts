import { BrevoClient } from '@getbrevo/brevo';
import { appointmentBookedTemplate } from '../templates/appointmentBooked.js';
import { appointApprovedTemplate } from '../templates/appointmentApproved.js';
import { appointmentCancelledTemplate } from '../templates/appointmentCancelled.js';
import { appointmentRescheduledTemplate } from '../templates/appointmentRescheduled.js';
import { passwordResetTemplate } from '../templates/passwordReset.js';
import mailGenerator from '../utils/mailGenerator.js';
import { doctorWelcomeTemplate } from '../templates/doctorWelcome.js';

const brevo=new BrevoClient({
    apiKey:process.env.BREVO_API_KEY!
})
export const sendEmail=async(to:string,subject:string,html:string)=>{
    try{
        console.log("Inside sendEmail");
        console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
        console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);
        await brevo.transactionalEmails.sendTransacEmail({
            sender:{
                name:"MediTrack Notifications",
                email:"meditrack.notifications@gmail.com",
            },
            to:[
                {
                    email:to,
                },
            ],
            subject,
            htmlContent:html,
        })
        console.log("Email sent successfully")
    }catch(err){
        console.error("Brevo Email Error",err);
        throw err;
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
    console.log("Inside sendDoctorWelcomeEmail");
    const mail=doctorWelcomeTemplate(name,email,password);
    const html=mailGenerator.generate(mail);
    await sendEmail(email,"Welcome to MediTrack-Doctor Account",html);
}