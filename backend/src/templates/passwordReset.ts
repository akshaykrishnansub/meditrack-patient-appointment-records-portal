export const passwordResetTemplate=(name:string,resetLink:string)=>{
    return {
        body:{
            name,

            intro:"We received a request to reset your MediTrack password.",

            action:{
                instructions: "Click the button below to reset your password.",
                button:{
                    color:"green",
                    text:"Reset Password",
                    link: resetLink,
                },
            },

            outro:"If you didn't request a password reset, you can safely ignore this email.",
        },
    }
}