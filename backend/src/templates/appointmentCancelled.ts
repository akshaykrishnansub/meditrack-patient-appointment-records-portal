export const appointmentCancelledTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return {
        body:{
            name:patientName,

            intro:"Your appointment has been Cancelled.",

            table:{
                data:[
                    {
                        Doctor: `Dr. ${doctorName}`,
                        Date: appointmentDate,
                        Time: appointmentTime,
                        Status: "CANCELLED"
                    },
                ],
            },
            outro: "Thank you for choosing MediTrack.",
        },
    };
}