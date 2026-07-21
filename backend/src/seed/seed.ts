import pool from "../db/connection.js";
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';

const seed=async()=>{
    try{
        console.log("Checking existing users....");
        const  existing=await pool.query(`SELECT COUNT(*) FROM users`);
        if(Number(existing.rows[0].count)>0){
            console.log("Database already seeded");
            process.exit(0);
        }

        const hashedPassword=await bcrypt.hash("Admin123@A",10);
        await pool.query(`INSERT into users (id,name,email,password_hash,role) VALUES ($1,$2,$3,$4) RETURNING *`,[uuidv4(),"meditrack_admin","admin@meditrack.com",hashedPassword,"ADMIN"]);
        console.log("Admin created successfully");
        console.log("Email: admin@meditrack.com");
        console.log("Password:Admin123@A");
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}