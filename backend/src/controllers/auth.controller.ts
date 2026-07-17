import type {Request,Response} from 'express'
import { createUser, findUserByEmail, findUserById, getAllDoctors, updatePassword } from '../models/auth.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendPasswordResetEmail } from '../services/email.service.js';
import { createAuditLog } from '../models/audit.model.js';

interface AuthRequest extends Request{
    user?:{
        id:string,
        role:string
    }
}

export const registerUser=async(req:Request,res:Response)=>{

    //Destructuring
    const {name,email,password} = req.body;
    try{
        //Check if user already exists
        const existingUser=await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({error:'User Already Registered'})
        }

        //Hashing password
        const hashedPassword=await bcrypt.hash(password,10);

        //Creating new user
        const newUser=await createUser(name,email,hashedPassword,"PATIENT");

        //Generating Token
        const token=jwt.sign({id:newUser.id},process.env.JWT_SECRET!,{expiresIn:'1d'})

        //return the success message
        return res.status(201).json({message:'User Registered successfully',token});
        
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'})
    }
}

export const login=async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    try{
        //find the user by email
        const user=await findUserByEmail(email);

        //check if user exists
        if(!user){
            return res.status(400).json({error:'User not found, Please try registering and sign in again'});
        }
        //compare the passwords
        const matchedPassword=await bcrypt.compare(password,user.password_hash);
        if(!matchedPassword){
            return res.status(401).json({error:"Invalid Credentials"});
        }

        //generate token
        const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET!,{expiresIn:'1d'});

        //store the token as a cookie
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:1*24*60*60*1000
        })

        await createAuditLog(user.id,"LOGIN",`${user.name} logged into the system`)

        return res.json({message:"Login Successful",token,user:{id:user.id,name:user.name,role:user.role}})

    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const getProfile=async(req:AuthRequest,res:Response)=>{
    try{
        const userId=req.user?.id;
        if(!userId){
            return res.status(401).json({error:'Authentication Failed'});
        }
        const user=await findUserById(userId);
        if(!user){
            return res.status(404).json({error:'User Not Found'});
        }
        return res.json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const logout=(req:Request,res:Response)=>{
    try{
        res.clearCookie('token',{
            path:"/",
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        })
        res.json({message:"Logged out Successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
}

export const getDoctors=async(req:Request,res:Response)=>{
    try{
        const doctors=await getAllDoctors();
        res.json(doctors);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const forgotPassword=async(req:Request,res:Response)=>{
    try{
        const {email}=req.body;
        const user=await findUserByEmail(email);
        if(!user){
            return res.json({message:"If an account with that email exists, a password reset link has been sent."});
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET!,{expiresIn:"15m"});
        const resetLink=`http://localhost:3000/reset-password?token=${token}`;
        await sendPasswordResetEmail(user.name,user.email,resetLink);
        return res.json({message:"If an account with that email exists, a password reset link has been sent."});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const resetPassword=async(req:Request,res:Response)=>{
    try{
        const {token,password}=req.body;
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET!) as{id:string};
        const hashedPassword=await bcrypt.hash(password,10);
        await updatePassword(decodedToken.id,hashedPassword);
        return res.json({message:"Password reset successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
}