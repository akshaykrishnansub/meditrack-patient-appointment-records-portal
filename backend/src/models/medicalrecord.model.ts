import pool from '../db/connection.js';

export const createMedicalRecord=async(userId:string,filePath:string,description:string)=>{
    const result=await pool.query(`INSERT into medicalrecord(userId,filePath,description) VALUES($1,$2,$3) RETURNING *`,[userId,filePath,description]);
    return result.rows[0];
}

export const getMedicalRecordById=async(id:string)=>{
    const result=await pool.query(`SELECT * FROM medicalrecord WHERE id=$1`,[id]);
    return result.rows[0];
}

export const getMedicalRecordsByUserId=async(userId:string)=>{
    const result=await pool.query(`SELECT * from medicalrecord WHERE userId=$1 ORDER BY uploadedAt DESC`,[userId]);
    return result.rows;
}

export const deleteMedicalRecord=async(id:string)=>{
    const result=await pool.query(`DELETE from medicalrecord WHERE id=$1 RETURNING *`,[id]);
    return result.rows[0];
}

export const getMedicalRecordsByDoctorId=async(doctorId:string)=>{
    const result=await pool.query(`SELECT DISTINCT medicalrecord.id,medicalrecord.filePath,medicalrecord.description,medicalrecord.uploadedAt,users.name AS patientName FROM medicalrecord JOIN appointment ON medicalrecord.userId=appointment.patientId JOIN users ON medicalrecord.userId=users.id WHERE appointment.doctorId=$1 ORDER BY medicalrecord.uploadedAt DESC`,[doctorId]);
    return result.rows;
}

export const isDoctorAssignedToPatient=async(doctorId:string,patientId:string)=>{
    const result=await pool.query(`SELECT id from appointment WHERE doctorId=$1 and patientId=$2 LIMIT 1`,[doctorId,patientId]);
    return result.rowCount!>0
}