import pool from "../db/connection.js"

export const createAuditLog=async(userId:string,action:string,details:string)=>{
    const result=await pool.query(`INSERT into auditlog (userId,action,details) VALUES ($1,$2,$3) RETURNING *`,[userId,action,details]);
    return result.rows[0];
}

export const getAuditLogs=async()=>{
    const result=await pool.query(`SELECT al.id,al.action,al.details,al.createdAt,u.name,u.email,u.role FROM auditlog al LEFT JOIN users u ON al.userId=u.id ORDER BY al.createdAt DESC `);
    return result.rows;
}