"use client"

import { createContext, useContext, useEffect, useState } from "react";

interface User{
    id:string;
    email:string;
    role:string
}

interface AuthContextType{
    user:User |null;
    logout:()=>Promise<void>;
    loading:boolean;
    checkAuth:()=>Promise<void>
}

const AuthContext=createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({
    children
}:{children:React.ReactNode;})=>{
const [user,setUser]=useState<User | null>(null);
const [loading,setLoading]=useState(true);

//Logout
const logout=async()=>{

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,{
        method:"POST",
        credentials:"include"
    })
    setUser(null);
}

//check auth on refresh
const checkAuth=async()=>{
    setLoading(true);
    try{
        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
            method:"GET",
            credentials:"include"
        })
        if(!res.ok){
            setUser(null);
            setLoading(false);
            return;
        }

        const data=await res.json();
        setUser(data.user);
        setLoading(false);
    }catch(err){
        setUser(null);
    }finally{
        setLoading(false);
    }
}

useEffect(()=>{
    checkAuth();
},[]);


return(
    <AuthContext.Provider value={{user,logout,loading,checkAuth}}>
        {children}
    </AuthContext.Provider>
)
}

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
