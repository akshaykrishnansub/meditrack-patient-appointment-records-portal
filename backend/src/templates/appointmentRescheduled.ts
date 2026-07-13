export const appointmentRescheduledTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return {
        body:{
            name:patientName,

            intro:"Your appointment has been Rescheduled.",

            table:{
                data:[
                    {
                        Doctor: `Dr. ${doctorName}`,
                        Date: appointmentDate,
                        Time: appointmentTime,
                        Status: "RESCHEDULED"
                    },
                ],
            },
            outro: "Thank you for choosing MediTrack.",
        },
    };
}