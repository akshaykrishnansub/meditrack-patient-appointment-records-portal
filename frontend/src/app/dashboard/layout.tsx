"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({children}:{children:React.ReactNode}){
    const {user,loading}=useAuth();
    const router=useRouter();

    useEffect(()=>{
        if(loading)
            return;
        if(!user){
            router.replace("/login");
        }
    },[user,loading,router]);

    if(loading){
        return <div>Loading...</div>
    }

    if(!user){
        return null;
    }

    return <>{children}</>
}