import type {Request,Response} from 'express'
import { createUser, findUserByEmail, findUserById } from '../models/auth.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
            secure:true,
            sameSite:"none",
            maxAge:1*24*60*60*1000
        })

        return res.json({message:"Login Successful",token,user:{id:user.id,name:user.name}})

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
        return res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}