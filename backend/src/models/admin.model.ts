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

export const createDoctor=async(name:string,email:string,password_hash:string)=>{
    const result=await pool.query(`INSERT into users (name,email,password_hash,role) VALUES($1,$2,$3,'DOCTOR') RETURNING id,name,email,role`,[name,email,password_hash]);
    return result.rows[0];
}

export const getUserById=async(id:string)=>{
    const result=await pool.query(`SELECT id,name,email,role FROM users WHERE id=$1`,[id]);
    return result.rows[0];
}

export const updateUser=async(id:string,name:string,email:string)=>{
    const result=await pool.query(`UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *`,[name,email,id]);
    return result.rows[0];
}

//to check whether the email is being used by anyone else
export const findUserByEmailExceptCurrentUser=async(email:string,id:string)=>{
    const result=await pool.query(`SELECT id FROM users WHERE email=$1 AND id!=$2 LIMIT 1`,[email,id]);
    return result.rows[0];
}

export const getAllAppointments=async()=>{
    const result=await pool.query(`SELECT a.id,p.name AS patient_name,p.email AS patient_email,d.name AS doctor_name,d.email AS doctor_email,a.datetime,a.status FROM appointment a JOIN users p ON a.patientId=p.id JOIN users d ON a.doctorId=d.id ORDER BY a.datetime ASC`);
    return result.rows;
}

export const getAllMedicalRecords=async()=>{
    const result=await pool.query(`SELECT DISTINCT ON (mr.id) mr.id,mr.description,mr.filePath,mr.uploadedAt,p.name as patient_name,p.email as patient_email,d.name as doctor_name,d.email as doctor_email FROM medicalrecord mr JOIN users p ON mr.userId=p.id LEFT JOIN appointment a ON a.patientId=mr.userId LEFT JOIN users d ON a.doctorId=d.id ORDER BY mr.id,mr.uploadedAt DESC`);
    return result.rows;
}

export const deleteMedicalRecordByAdmin=async(id:string)=>{
    const result=await pool.query(`DELETE from medicalrecord WHERE id=$1 RETURNING *`,[id]);
    return result.rows[0];
}

export const getMedicalRecordByAdmin=async(id:string)=>{
    const result=await pool.query(`SELECT filepath FROM medicalrecord WHERE id=$1`,[id]);
    return result.rows[0];
}

export const getDashboardStats=async()=>{
    const [users,doctors,appointments,records,recentActivity]=await Promise.all([
        pool.query("SELECT COUNT(*) from users"),
        pool.query("SELECT COUNT(*) from users where role='DOCTOR'"),
        pool.query("SELECT COUNT(*) from appointment"),
        pool.query("SELECT COUNT(*) from medicalrecord "),
        pool.query(`SELECT id,action,details,createdAt FROM auditlog ORDER BY createdAt DESC LIMIT 5`)
    ]);
    return {totalUsers: Number(users.rows[0].count),
        totalDoctors:Number(doctors.rows[0].count),
        totalAppointments:Number(appointments.rows[0].count),
        totalRecords:Number(records.rows[0].count),
        recentActivity:recentActivity.rows
    }
}