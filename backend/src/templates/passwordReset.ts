export const passwordResetTemplate=(name:string,resetLink:string)=>{
    return `
    
    Hello ${name},
    
    We have received a request to reset your MediTrack Password.
    
    Click the link below to reset your password:
    
    ${resetLink}
    
    This link is valid only for 15 minutes.
    
    If you did not request a password reset, you can safely ignore this mail.
    
    Thank you
    
    MediTrack`;
}