export const appointmentRescheduledTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return `
    Hello ${patientName},
    
    Your appointment has been rescheduled.
    
    Doctor Name: Dr. ${doctorName}
    
    New Date: ${appointmentDate}
    
    New Time: ${appointmentTime}
    
    status: RESCHEDULED
    
    Please make use of the updated appointment schedule.
    
    Thank you
    
    MediTrack`;
}