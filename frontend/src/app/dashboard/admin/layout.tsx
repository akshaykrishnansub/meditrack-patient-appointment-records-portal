"use client"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const AdminDashboardLayout = ({children}:{children:React.ReactNode}) => {
    const {user,loading}=useAuth();
    const router=useRouter();

    useEffect(()=>{
        if(loading){
        return;
    }
    
    if(!user){
        router.push("/login");
        return;
    }

    if(user.role !== "ADMIN"){
        router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
})
  return (
    <>{children}</>
  )
}

export default AdminDashboardLayout