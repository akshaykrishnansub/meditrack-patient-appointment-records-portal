import pool from '../db/connection.js'

export const createUser=async(name:string,email:string,password_hash:string,role:string)=>{
    const result=await pool.query('INSERT INTO users(name,email,password_hash,role) values($1,$2,$3,$4) returning *',[name,email,password_hash,role]);
    return result.rows[0];
}

export const findUserByEmail=async(email:string)=>{
    const result=await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    return result.rows[0];
}

export const findUserById=async(id:string)=>{
    const result=await pool.query('SELECT id,name,email,role FROM users WHERE id=$1',[id]);
    return result.rows[0];
}

export const getAllDoctors=async()=>{
    const result=await pool.query("SELECT id,name,email FROM users WHERE role='DOCTOR' ORDER BY name");
    return result.rows;
}

export const updatePassword=async(id:string,password_hash:string)=>{
    const result=await pool.query(`UPDATE users SET password_hash=$1 WHERE id=$2 RETURNING *`,[password_hash,id]);
    return result.rows[0];
}

export const updateUserProfile=async(id:string,name:string,email:string)=>{
    const result=await pool.query(`UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *`,[name,email,id]);
    return result.rows[0];
}