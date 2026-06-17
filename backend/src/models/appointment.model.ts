import pool from "../db/connection.js"


//Create Appointment
export const createAppointment=async(patientId:string,doctorId:string,datetime:string)=>{
    const result=await pool.query(`INSERT into appointment(patientId,doctorId,datetime,status) VALUES($1,$2,$3,'SCHEDULED') RETURNING *`,[patientId,doctorId,datetime]);
    return result.rows[0];
}