"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Appointment = () => {
  const {logout}=useAuth();
  const router=useRouter();

  const [appointments,setAppointments]=useState([]);
  const [profile,setProfile]=useState<any>(null)
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);

  useEffect(() => {
    document.title = "Patient Appointments | MediTrack";
  },[]);

  const fetchPatientProfile=async()=>{
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
      credentials:"include"
    })
    const data=await res.json();
    if(!res.ok){
      showToast(data.error || "Failed to fetch Patient Profile","error");
      return;
    }
    setProfile(data.user);
    console.log(data);
  }

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchAppointments=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,{
        credentials:"include"
      })

      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to fetch Appointments","error");
        return;
      }
      setAppointments(data);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  useEffect(()=>{
    fetchPatientProfile();
    fetchAppointments();
  },[]);

  const cancelAppointment=async(id:string)=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}/cancel`,{
        method:"PATCH",
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to cancel appointment","error");
        return;
      }

      setAppointments((prev:any)=>
      prev.map((appt:any)=>
      appt.id===id?{...appt,status:"CANCELLED"}:appt
      )
    );
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }


  return (
    <div className='bg-gray-100 flex min-h-screen'>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 lg:block`}>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
          <button className="lg:hidden" onClick={()=>setSidebarOpen(false)}>X</button>
        </div>
        <nav className='space-y-4'>
          <Link href="/dashboard/patient" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Patient Dashboard</Link>
          <Link href="/dashboard/patient/appointments" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/patient/records" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
          <Link href="/dashboard/patient/profile" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
          <Link href="/dashboard/patient/messages" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 md:p-8 lg:ml-64 p-4 overflow-x-auto'>
        <div className='lg:hidden mb-6'>
          <button onClick={()=>setSidebarOpen(true)} className='p-2 shadow cursor-pointer'>☰</button>
        </div>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Welcome, {profile?.name}</h1>
        </div>
        <h1 className='text-3xl'>My Appointments</h1>
        <div className='mt-4'>
          <Link href="/dashboard/patient/appointments/book" className='text-white font-bold text-xl px-4 py-2 bg-green-900 rounded'>+ Book Appointment</Link>
        </div>
          <div className='bg-white mb-8 p-6 mt-6 rounded-lg shadow'>
            {appointments.length===0?(
              <p className='text-gray-500'>No Appointments Found</p>
            ):(
              appointments.map((appointment:any)=>(
                <div key={appointment.id} className='mb-6 border-b pb-4'>
                  <p className='text-xl font-bold mt-2'>Doctor Name: <span className='font-normal'>{appointment.name}</span></p>
                  <p className='text-xl font-bold mt-2'>Date of Appointment: <span className='font-normal'>{appointment.datetime?.split("T")[0]}</span></p>
                  <p className='text-xl font-bold mt-2'>Time of Appointment: <span className='font-normal'>{new Date(appointment.datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}</span></p>
                  <p className='text-xl font-bold mt-2'>Appointment Status:{" "}<span className={`font-normal ${appointment.status === "PENDING"? "text-yellow-600": appointment.status === "CANCELLED"? "text-red-600": "text-green-600"}`}>{appointment.status}</span></p>
                  {appointment.status==="PENDING" &&(
                    <button onClick={()=>cancelAppointment(appointment.id)} className='mt-4 text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded cursor-pointer font-bold'>Cancel Appointment</button>
                  )}
                </div>
              ))
            )}
          </div>
      </main>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default Appointment