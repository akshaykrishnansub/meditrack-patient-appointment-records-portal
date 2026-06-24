"use client"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const PatientDashboardLayout = ({children}:{children:React.ReactNode}) => {
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

        if(user.role !== "PATIENT"){
            router.push(`/dashboard/${user.role.toLowerCase()}`);
        }
    },[user,loading,router]);

    if(loading){
        return <div>Loading...</div>
    }
  return (
    <>
    {children}
    </>
  )
}

export default PatientDashboardLayout