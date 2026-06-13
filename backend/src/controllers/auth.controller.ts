import type {Request,Response} from 'express'
import { createUser, findUserByEmail } from '../models/auth.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser=async(req:Request,res:Response)=>{

    //Destructuring
    const {name,email,password_hash,role} = req.body;
    try{
        //Check if user already exists
        const existingUser=await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({error:'User Already Registered'})
        }

        //Hashing password
        const hashedPassword=await bcrypt.hash(password_hash,10);

        //Creating new user
        const newUser=await createUser(name,email,hashedPassword,role);

        //Generating Token
        const token=jwt.sign({id:newUser.id},process.env.JWT_TOKEN!,{expiresIn:'1d'})

        //return the success message
        return res.status(201).json({message:'User Registered successfully'});
        
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'})
    }
}