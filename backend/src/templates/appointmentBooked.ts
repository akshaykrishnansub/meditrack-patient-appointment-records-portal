export const appointmentBookedTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return `
    Hello ${patientName},
    
    Your appointment has been booked successfully.
    
    Doctor: Dr. ${doctorName}
    
    Date: ${appointmentDate}
    
    Time: ${appointmentTime}
    
    Status: PENDING
    
    Thank you,
    
    MediTrack`
}