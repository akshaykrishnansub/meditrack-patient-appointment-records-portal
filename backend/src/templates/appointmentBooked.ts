export const appointmentBookedTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return {
        body:{
            name:patientName,

            intro:"Your appointment has been booked successfully.",

            table:{
                data:[
                    {
                        Doctor: `Dr. ${doctorName}`,
                        Date: appointmentDate,
                        Time: appointmentTime,
                        Status: "PENDING"
                    },
                ],
            },
            outro: "Thank you for choosing MediTrack.",
        },
    };
};