"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Appointment = () => {
  const {logout}=useAuth();
  const router=useRouter();

  const [appointments,setAppointments]=useState([]);

  useEffect(() => {
    document.title = "Patient Appointments | MediTrack";
  },[]);

  const fetchAppointments=async()=>{
    try{
      const res=await fetch('http://localhost:5000/api/appointments',{
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
      alert("Something went wrong");
    }
  }

  useEffect(()=>{
    fetchAppointments();
  },[]);

  const cancelAppointment=async(id:string)=>{
    try{
      const res=await fetch(`http://localhost:5000/api/appointments/${id}/cancel`,{
        method:"PATCH",
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error || "Failed to cancel appointment");
        return;
      }

      setAppointments((prev:any)=>
      prev.map((appt:any)=>
      appt.id===id?{...appt,status:"CANCELLED"}:appt
      )
    );
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }


  return (
    <div className='bg-gray-100 flex'>
      <aside className='hidden lg:block bg-white w-64 min-h-screen shadow p-6'>
        <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
        <nav className='space-y-4'>
          <Link href="/dashboard/patient" className='block font-bold p-2 rounded hover:bg-green-200'>Patient Dashboard</Link>
          <Link href="/dashboard/patient/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/patient/records" className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
          <Link href="/dashboard/patient/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
          <Link href="/dashboard/patient/messages" className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 p-8'>
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
                  <p className='text-xl font-bold mt-2'>Time of Appointment: <span className='font-normal'>{new Date(appointment.datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true,timeZone:"Asia/Kolkata"})}</span></p>
                  <p className='text-xl font-bold mt-2'>Appointment Status:{" "}<span className={`font-normal ${appointment.status === "PENDING"? "text-yellow-600": appointment.status === "CANCELLED"? "text-red-600": "text-green-600"}`}>{appointment.status}</span></p>
                  {appointment.status==="PENDING" &&(
                    <button onClick={()=>cancelAppointment(appointment.id)} className='mt-4 text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded cursor-pointer font-bold'>Cancel Appointment</button>
                  )}
                </div>
              ))
            )}
          </div>
      </main>
    </div>
  )
}

export default Appointment