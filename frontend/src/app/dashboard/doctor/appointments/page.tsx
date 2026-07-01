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

  const fetchDoctorProfile=async()=>{
    try{
      const res=await fetch("http://localhost:5000/api/auth/me",{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      setProfile(data.user);
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  const handleCancel=async(id:string)=>{
    try{
      const res=await fetch(`http://localhost:5000/api/appointments/${id}/cancel`,{
        method:"PATCH",
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      alert("Appointment Cancelled");
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
      const res=await fetch("http://localhost:5000/api/appointments",{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      setAppointments(data);
    }catch(err){
      console.error(err);
      alert('Something went wrong');
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
      alert("Please select a date and time");
      return;
    }

    try{
      const res=await fetch(`http://localhost:5000/api/appointments/${selectedAppointmentId}/reschedule`,{
        method:"PATCH",
        credentials:"include",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({datetime:newDateTime})
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }

      alert("Appointment Rescheduled Successfully");
      setShowModal(false);
      fetchAppointments();

    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <div className='bg-gray-100 flex'>
        {/*Sidebar */}
        <aside className='hidden lg:block min-h-screen w-64 bg-white shadow-md p-6'>
            <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
            <nav className='space-y-4'>
                <Link href="/dashboard/doctor" className='block font-bold p-2 rounded hover:bg-green-200'>Doctor Dashboard</Link>
                <Link href="/dashboard/doctor/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
                <Link href="/dashboard/doctor/records" className='block font-bold p-2 rounded hover:bg-green-200'>Patient Records</Link>
                <Link href="/dashboard/doctor/messages" className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
                <Link href="/dashboard/doctor/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Doctor Profile</Link>
                <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
            </nav>
        </aside>
        <main className='flex-1 p-8'>
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
                  <p className='text-xl font-bold mt-2'>Appointment Status:{" "}<span className={`text-xl font-normal ${appointment.status === "PENDING"? "text-yellow-600": appointment.status === "CANCELLED"? "text-red-600": "text-green-600"}`}>{appointment.status}</span></p>
                  {appointment.status==="PENDING" && (
                    <div className='flex gap-2 mt-2'>
                      <button className='bg-green-700 text-white font-bold p-2 rounded'>Approve</button>
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
              />
              <div className='flex gap-2 justify-end mt-6'>
                <button onClick={()=>setShowModal(false)} className='bg-red-800 text-white px-4 py-2 rounded font-bold cursor-pointer hover:bg-red-600'>Cancel</button>
                <button onClick={handleReschedule} className='bg-green-800 text-white px-4 py-2 rounded font-bold cursor-pointer hover:bg-green-700'>Save</button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default DoctorAppointments