"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DoctorAppointments = () => {

  const {logout}=useAuth();
  const router=useRouter();
  const [profile,setProfile]=useState<any>(null);
  const [appointments,setAppointments]=useState<any[]>([])

  const [showModal,setShowModal]=useState<boolean>(false);
  const [selectedAppointmentId,setSelectedAppointmentId]=useState<string>("");
  const [newDateTime,setNewDateTime]=useState<string>("");
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

  useEffect(() => {
    document.title = "Doctor Appointments | MediTrack";
  },[]);

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchDoctorProfile=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
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

  const handleApprove=async(id:string)=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}/approve`,{
        method:"PATCH",
        credentials:"include"
      })

      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to approved appointment","error");
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
        showToast(data.error || "Failed to Cancel Appointment","error");
        return;
      }
      showToast("Appointment Cancelled","success");
      fetchAppointments();
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  useEffect(()=>{
    fetchDoctorProfile();
    fetchAppointments();
  },[])

  const fetchAppointments=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to fetch appointments","error");
        return;
      }
      setAppointments(data);
    }catch(err){
      console.error(err);
      showToast('Something went wrong',"error");
    }
  }

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  const openRescheduleModal=(appointmentId:string)=>{
    setSelectedAppointmentId(appointmentId);
    setNewDateTime("");
    setShowModal(true);
  }

  const handleReschedule=async()=>{
    if(!newDateTime){
      showToast("Please select a date and time",'warning');
      return;
    }

    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${selectedAppointmentId}/reschedule`,{
        method:"PATCH",
        credentials:"include",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({datetime:newDateTime})
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to Reschedule Appointment","error");
        return;
      }

      showToast("Appointment Rescheduled Successfully","success");
      setShowModal(false);
      fetchAppointments();

    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  return (
    <div className='bg-gray-100 flex min-h-screen'>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}
        {/*Sidebar */}
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
        <main className='flex-1 lg:p-8 lg:ml-64 p-4 overflow-x-auto'>
          <div className='lg:hidden mb-6'>
            <button onClick={()=>setSidebarOpen(true)} className='p-2 shadow cursor-pointer'>☰</button>
          </div>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold'>Hello, Dr. {profile?.name}</h1>
            <p className='mt-2 text-xl'>View all your appointments here</p>
          </div>
          <div className='mb-6 bg-white p-6 shadow rounded'>
            {appointments.length===0?(
              <p className='text-gray-500'>No Appointments found</p>
            ):(
              appointments.map((appointment:any)=>(
                <div key={appointment.id} className='mb-6 border-b pb-4'>
                  <p className='text-xl font-bold mt-2'>Patient Name:{" "}<span className='text-xl font-normal'>{appointment.name}</span></p>
                  <p className='text-xl font-bold mt-2'>Appointment Date:{" "}<span className='text-xl font-normal'>{new Date(appointment.datetime).toLocaleDateString()}</span></p>
                  <p className='text-xl font-bold mt-2'>Appointment Time:{" "}<span className='text-xl font-normal'>{new Date(appointment.datetime).toLocaleTimeString("en-IN",{"hour":"2-digit","minute":"2-digit"})}</span></p>
                  <p className='text-xl font-bold mt-2'>Appointment Status:{" "}<span className={`text-xl font-normal ${appointment.status === "PENDING"? "text-yellow-600": appointment.status === "CANCELLED"? "text-red-600":appointment.status==="RESCHEDULED"?"text-green-950":"text-green-600"}`}>{appointment.status}</span></p>
                  {appointment.status==="PENDING" && (
                    <div className='flex gap-2 mt-2'>
                      <button onClick={()=>handleApprove(appointment.id)} className='bg-green-700 text-white font-bold p-2 rounded cursor-pointer'>Approve</button>
                      <button onClick={()=>openRescheduleModal(appointment.id)} className='bg-yellow-600 text-white font-bold p-2 rounded'>Reschedule</button>
                      <button onClick={()=>handleCancel(appointment.id)} className='bg-red-700 text-white font-bold p-2 rounded cursor-pointer'>Cancel</button>
                    </div>
                  )}
                  {appointment.status==="APPROVED" && (
                    <div className='flex gap-2 mt-2'>
                      <button onClick={()=>openRescheduleModal(appointment.id)} className='bg-yellow-600 text-white font-bold p-2 rounded'>Reschedule</button>
                      <button onClick={()=>handleCancel(appointment.id)} className='bg-red-700 text-white font-bold p-2 rounded cursor-pointer'>Cancel</button>
                    </div>
                  )}
                  {appointment.status==="RESCHEDULED" && (
                    <div className='flex gap-2 mt-2'>
                      <button onClick={()=>handleCancel(appointment.id)} className='bg-red-700 text-white font-bold p-2 rounded cursor-pointer'>Cancel</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
        {showModal && (
          <div className='fixed inset-0 bg-black/75 flex justify-center items-center z-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
              <h2 className='text-2xl font-bold mb-4'>Reschedule Appointment</h2>
              <input type="datetime-local"
              value={newDateTime}
              onChange={(e)=>setNewDateTime(e.target.value)}
              className='w-full border p-2 rounded'
              required
              />
              <div className='flex gap-2 justify-end mt-6'>
                <button onClick={()=>setShowModal(false)} className='bg-red-800 text-white px-4 py-2 rounded font-bold cursor-pointer hover:bg-red-600'>Cancel</button>
                <button onClick={handleReschedule} className='bg-green-800 text-white px-4 py-2 rounded font-bold cursor-pointer hover:bg-green-700'>Save</button>
              </div>
            </div>
          </div>
        )}
        {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default DoctorAppointments