import pool from "../db/connection.js";

export const getAllUsers=async()=>{
    const result=await pool.query(`SELECT id,name,email,role FROM users ORDER BY name ASC`);
    return result.rows;
}

export const deleteUser=async(id:string)=>{
    const result=await pool.query(`DELETE from users WHERE id=$1 RETURNING *`,[id]);
    return result.rows[0];
}

export const hasActiveAppointments=async(userId:string)=>{
    const result=await pool.query(`SELECT id from appointment WHERE (patientId=$1 OR doctorId=$1) AND status IN ('PENDING','APPROVED','RESCHEDULED') LIMIT 1`,[userId]);
    return result.rows.length>0;
}

export const deleteCancelledAppointments=async(userId:string)=>{
    const result=await pool.query(`DELETE from appointment WHERE (patientId=$1 OR doctorId=$1) AND status='CANCELLED' RETURNING *`,[userId]);
    return result.rows;
}

export const deleteUserMessages=async(userId:string)=>{
    const result=await pool.query(`DELETE from message WHERE senderId=$1 OR receiverId=$1 RETURNING *`,[userId]);
    return result.rows;
}

export const getUserMedicalRecords=async(userId:string)=>{
    const result=await pool.query(`SELECT filePath from medicalrecord WHERE userId=$1`,[userId]);
    return result.rows;
}

export const deleteUserMedicalRecords=async(userId:string)=>{
    const result=await pool.query(`DELETE from medicalrecord WHERE userId=$1 RETURNING *`,[userId]);
    return result.rows;
}