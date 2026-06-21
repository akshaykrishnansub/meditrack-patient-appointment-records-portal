import type { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request{
    user?:{
        id:string,
        role:string
    }
}

export const verifyToken=(req:AuthRequest,res:Response,next:NextFunction)=>{

    //Read token from cookies
    const token=req.cookies.token;

    //if token does not exist, block the request
    if(!token){
        return res.status(401).json({error:"Access Denied"});
    }

    try{
        //decode the user payload
        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as {id:string,role:string};
        console.log(decoded);
        req.user=decoded;
        next();
    }catch(err){
        console.error(err);
        res.status(403).json({error:"Invalid Token"});
    }


}