"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({children}:{children:React.ReactNode}){
    const {user}=useAuth();
    const router=useRouter();

    useEffect(()=>{
        if(!user){
            router.replace("/login");
            return;
        }
    },[user]);

    if(!user){
        return null;
    }

    return <>{children}</>
}