"use client"

import { createContext, useContext, useState } from "react";

interface User{
    id:string;
    email:string;
    role:string
}

interface AuthContextType{
    user:User |null;
    token:string | null;
    login: (token:string,user:User)=>void;
    logout:()=>void;
}

const AuthContext=createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({
    children
}:{children:React.ReactNode;})=>{
const [user,setUser]=useState<User | null>(null);
const [token,setToken]=useState<string | null>(null);
const login=(token:string , user:User)=>{
    setToken(token);
    setUser(user);
};
const logout=()=>{
    setToken(null);
    setUser(null);
}

return(
    <AuthContext.Provider value={{user,token,login,logout}}>
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
