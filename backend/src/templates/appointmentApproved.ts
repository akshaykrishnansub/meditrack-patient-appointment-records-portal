export const appointApprovedTemplate=(patientName:string,doctorName:string,appointmentDate:string,appointmentTime:string)=>{
    return {
        body:{
            name:patientName,

            intro:'Your appointment has been approved successfully.',

            table:{
                data:[
                    {
                        Doctor: `Dr. ${doctorName}`,
                        Date: appointmentDate,
                        Time: appointmentTime,
                        status: "APPROVED"
                    },
                ],
            },
            outro: "Thank you for choosing MediTrack.",
        },
    };
};