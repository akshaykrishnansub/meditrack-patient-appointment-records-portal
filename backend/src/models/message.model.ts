import pool from "../db/connection.js"

export const createMessage=async(senderId:string,receiverId:string,content:string)=>{
    const result=await pool.query(`INSERT into message (senderId,receiverId,content) VALUES($1,$2,$3) RETURNING *`,[senderId,receiverId,content]);
    return result.rows[0];
}

export const getMessages=async(userId:string,otherUserId:string)=>{
    const result=await pool.query(`SELECT * from message WHERE (senderId=$1 AND receiverId=$2) OR (senderId=$2 AND receiverId=$1) ORDER BY sentAt ASC`,[userId,otherUserId]);
    return result.rows;
}

//for sidebar
export const getPatientConversations=async(patientId:string)=>{
    const result=await pool.query(`SELECT DISTINCT users.id,users.name from appointment JOIN users ON appointment.doctorId=users.id WHERE appointment.patientId=$1`,[patientId]);
    return result.rows;
}

//for sidebar
export const getDoctorConversations=async(doctorId:string)=>{
    const result=await pool.query(`SELECT DISTINCT users.id,users.name from appointment JOIN users ON appointment.patientId=users.id WHERE appointment.doctorId=$1`,[doctorId]);
    return result.rows;
}