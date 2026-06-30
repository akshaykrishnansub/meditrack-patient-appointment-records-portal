import pool from "../db/connection.js"


//Create Appointment
export const createAppointment=async(patientId:string,doctorId:string,datetime:string)=>{
    const result=await pool.query(`INSERT into appointment(patientId,doctorId,datetime,status) VALUES($1,$2,$3,'PENDING') RETURNING *`,[patientId,doctorId,datetime]);
    return result.rows[0];
}

//GET all (admin)
export const getAllAppointments=async()=>{
    const result=await pool.query('SELECT * from appointment ORDER BY datetime DESC');
    return result.rows;
}

//GET appointment by patient
export const getAppointmentsByPatientId=async(patientId:string)=>{
    const result=await pool.query('SELECT * FROM appointment WHERE patientId=$1 ORDER BY datetime ASC',[patientId]);
    return result.rows;
}

//GET appointment by doctor
export const getAppointmentsByDoctorId=async(doctorId:string)=>{
    const result=await pool.query('SELECT * from appointment WHERE doctorId=$1 ORDER BY datetime DESC',[doctorId]);
    return result.rows;
}

//UPDATE appointment status (approve or cancel)
export const updateStatus=async(id:string, status:string)=>{
    const result=await pool.query('UPDATE appointment SET status=$1 WHERE id=$2 RETURNING *',[status,id]);
    return result.rows[0];
}

//RESCHEDULE appointment
export const rescheduleAppointment=async(id:string,datetime:string)=>{
    const result=await pool.query("UPDATE appointment SET datetime=$1,status='RESCHEDULED' WHERE id=$2 RETURNING *",[datetime,id]);
    return result.rows[0];
}

//Checking doctor availability
export const checkDoctorAvailability=async(doctorId:string,datetime:string)=>{
    const result=await pool.query("SELECT * from appointment WHERE doctorId=$1 AND datetime=$2 AND status!='CANCELLED'",[doctorId,datetime]);
    return result.rows.length===0;
}

//Get appointment details with doctor name
export const getPatientAppointmentWithDoctorName=async(patientId:string)=>{
    const result=await pool.query('SELECT appointment.id,users.name,appointment.datetime,appointment.status FROM appointment JOIN users ON appointment.doctorId=users.id WHERE appointment.patientId=$1',[patientId]);
    return result.rows;
}