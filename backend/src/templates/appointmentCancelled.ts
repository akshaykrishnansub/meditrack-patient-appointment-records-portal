export const appointmentCancelledTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return `
    
    Hello ${patientName},
    
    We regret to inform you that your appointment has been cancelled.
    
    Doctor: Dr. ${doctorName}
    
    Date: ${appointmentDate}
    
    Time: ${appointmentTime}
    
    Status: CANCELLED
    
    If you still require a consultation, please login to MediTrack and book another appointment at your convenience.
    
    Thank you,
    
    MediTrack`;
}