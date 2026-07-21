"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DoctorDashboard = () => {
  const {logout}=useAuth();
  const router=useRouter();
  const [profile,setProfile]=useState<any>(null);
  const [appointments,setAppointments]=useState<any[]>([]);
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

  useEffect(() => {
    document.title = "Doctor Dashboard | MediTrack";
  },[]);

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchProfile=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
        credentials:"include"
      })

      const data=await res.json();
      console.log(data.user);
      if(!res.ok){
        showToast(data.error || "Failed to view profile name","error");
        return;
      }

      setProfile(data.user);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  const handleApprove=async(id:string)=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}/approve`,{
        method:"PATCH",
        credentials:"include"
      })

      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to approve appointment","error");
        return;
      }

      showToast("Appointment Approved","success");

      fetchAppointments();

    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  const handleCancel=async(id:string)=>{
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

      showToast("Appointment Cancelled","success");
      fetchAppointments();

    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  const fetchAppointments=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,{
        "credentials":"include"
      })

      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to fetch appointment details","error");
        return;
      }
      console.log(data);
      setAppointments(data);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  useEffect(()=>{
    fetchProfile();
    fetchAppointments();
  },[]);


  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  const today=new Date().toDateString();

  const todaysAppointments=appointments.filter((appointment:any)=>{
    return(
      new Date(appointment.datetime).toDateString()===today && appointment.status !=="CANCELLED"
    );
  });

  const pendingAppointments=appointments.filter((appointment:any)=>{
    return(
      appointment.status==="PENDING"
    )
  })

  const rescheduledAppointments=appointments.filter((appointment:any)=>{
    return(
      appointment.status==="RESCHEDULED"
    )
  })

  return (
    <div className='bg-gray-100 flex min-h-screen'>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}
      {/*sidebar*/}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 lg:block`}>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold mb-8 '>Medi<span className='text-green-600'>Track</span></h1>
          <button className="lg:hidden" onClick={()=>setSidebarOpen(false)}>X</button>
        </div>
        <nav className='space-y-4'>
          <Link href="/dashboard/doctor" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Doctor Dashboard</Link>
          <Link href="/dashboard/doctor/appointments" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/doctor/records" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Patient Records</Link>
          <Link href="/dashboard/doctor/messages" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
          <Link href="/dashboard/doctor/profile" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Doctor Profile</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 md:p-8 lg:ml-64 p-4 overflow-x-auto'>
        <div className='lg:hidden mb-6'>
          <button onClick={()=>setSidebarOpen(true)} className='p-2 shadow cursor-pointer'>☰</button>
        </div>
        {/*Welcome doctor section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Welcome, Dr.{" "}{profile?.name}</h1>
          <p className='mt-4'>View, Approve, Reschedule, Cancel Appointments and View Patient Records</p>
        </div>
        {/*Stats section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Today's appointments</h3>
            <p className='text-3xl font-bold mt-2'>{todaysAppointments.length}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Pending Approvals</h3>
            <p className='text-3xl font-bold mt-2'>{pendingAppointments.length}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Rescheduled Appointments</h3>
            <p className='text-3xl font-bold mt-2'>{rescheduledAppointments.length}</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow mb-8'>
          <h3 className='text-2xl font-bold'>Pending Requests</h3>
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {pendingAppointments.length===0?(
              <p className='mt-4 text-xl font-medium'>No Pending Appointment Requests</p>
            ):(
              pendingAppointments.map((appointment:any)=>(
              <div key={appointment.id} className='bg-white p-6 shadow rounded mt-2 hover:border border-green-800'>
              <p className='text-xl font-semibold'>Patient Name: <span className='font-normal text-xl'>{appointment.name}</span></p>
              <p className='text-xl font-semibold'>Date:{" "}<span className='font-normal text-xl'>{new Date(appointment.datetime).toLocaleDateString()}</span></p>
              <p className='text-xl font-semibold'>Time:{" "}<span className='font-normal text-xl'>{new Date(appointment.datetime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span></p>
              <div className='mt-4 flex flex-col lg:flex-row gap-2'>
                <button onClick={()=>handleApprove(appointment.id)}className='bg-green-700 text-white font-bold p-2 rounded'>Approve</button>
                <button className='bg-yellow-600 text-white font-bold p-2 rounded'>Reschedule</button>
                <button onClick={()=>handleCancel(appointment.id)} className='bg-red-700 text-white font-bold p-2 rounded'>Cancel</button>
              </div>
            </div>
            ))
            )}
          </div>
        </div>
        <div className='bg-white mb-8 p-6 rounded-lg shadow'>
          <h3>Quick Actions</h3>
          <div className='mt-4 flex flex-col lg:flex-row gap-2'>
            <Link href="/dashboard/doctor/records" className='text-white font-bold px-4 py-2 rounded bg-green-700 hover:bg-green-600'>Patient Records</Link>
            <Link href="/dashboard/doctor/appointments" className='text-white font-bold px-4 py-2 rounded bg-blue-700 hover:bg-blue-600'>Appointments</Link>
            <Link href="/dashboard/doctor/messages" className='text-white font-bold px-4 py-2 rounded bg-purple-700 hover:bg-purple-600'>Messages</Link>
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

export default DoctorDashboard