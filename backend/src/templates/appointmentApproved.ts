export const appointApprovedTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return `
    Hello ${patientName},
    
    Congratulations!!! Your appointment has been Approved.
    
    Doctor: Dr. ${doctorName}
    
    Date: ${appointmentDate}
    
    Time: ${appointmentTime}
    
    status: APPROVED
    
    Please arrive at least 10 minutes before your scheduled appointment.
    
    Thank you,
    
    MediTrack`;
}