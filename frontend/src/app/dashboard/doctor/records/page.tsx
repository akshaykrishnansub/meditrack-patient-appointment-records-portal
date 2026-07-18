"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const DoctorRecords = () => {
    const {logout}=useAuth();
    const router=useRouter();

    const [profile,setProfile]=useState<any>(null);
    const [records,setRecords]=useState<any[]>([]);
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

    useEffect(() => {
        document.title = "Doctor Medical Records | MediTrack";
    },[]);

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

    const fetchDoctorRecords=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/records/doctor",{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to fetch doctor records","error");
                return;
            }
            setRecords(data);
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }

    const handleView=async(id:string)=>{
        try{
            const res=await fetch(`http://localhost:5000/api/records/view/${id}`,{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to download the record","error");
                return;
            }
            window.open(data.url,"_blank");
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }

    const fetchDoctorProfile=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/auth/me",{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to fetch doctor profile","error");
                return;
            }
            setProfile(data.user);
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }

    useEffect(()=>{
        fetchDoctorProfile();
        fetchDoctorRecords();
    },[]);

    const handleLogout=async()=>{
        await logout();
        router.push("/login");
    }

  return (
    <div className='bg-gray-100 flex'>
        <aside className='hidden lg:block bg-white w-64 min-h-screen p-6 shadow-md'>
            <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
            <nav className='space-y-4'>
                <Link href="/dashboard/patient" className='block font-bold p-2 rounded hover:bg-green-200'>Patient Dashboard</Link>
                <Link href="/dashboard/doctor/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
                <Link href="/dashboard/doctor/records" className='block font-bold p-2 rounded hover:bg-green-200'>Patient Records</Link>
                <Link href="/dashboard/doctor/messages" className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
                <Link href="/dashboard/doctor/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Doctor Profile</Link>
                <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
            </nav>
        </aside>
        <main className='flex-1 p-8 min-h-screen'>
            {/*Hello Doctor section */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold'>Welcome, Dr.{" "}{profile?.name}</h1>
                <p className='mt-4'>View the medical records of the patient here.</p>
                <div className='bg-white p-6 rounded-lg shadow mt-4'>
                    <h2 className='text-2xl font-semibold mb-6'>Patient Medical Records</h2>
                    {records.length===0?(
                        <p className='text-gray-600'>No Medical Records found.</p>
                    ):(
                        records.map((record:any)=>(
                            <div key={record.id} className='border rounded-lg p-5 mb-5'>
                                <p className='text-xl font-bold'>Patient:{" "}<span className='font-normal'>{record.patientname}</span></p>
                                <p className='mt-2 text-xl font-bold'>Description:{" "}<span className='font-normal'>{record.description}</span></p>
                                <p className='mt-2 text-xl font-bold'>Uploaded At:{" "}<span className='font-normal'>{new Date(record.uploadedat).toLocaleDateString()}</span></p>
                                <div className='mt-5'>
                                    <button onClick={()=>handleView(record.id)} className='bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer'>View</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
        {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default DoctorRecords