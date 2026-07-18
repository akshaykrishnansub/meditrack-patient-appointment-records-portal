"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';

const PatientDashboard = () => {
  const {logout}=useAuth();
  const router=useRouter();

  const [profile,setProfile]=useState<any>(null);
  const [appointments,setAppointments]=useState<any[]>([]);
  const [recordCount,setRecordCount]=useState<number>(0);
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);

  useEffect(() => {
    document.title = "Patient Dashboard | MediTrack";
  },[]);

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchMedicalRecords=async()=>{
    try{
      const res=await fetch("http://localhost:5000/api/records",{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to load medical records","error");
        return;
      }
      setRecordCount(data.length);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  const fetchAppointments=async()=>{
    try{
      const res=await fetch("http://localhost:5000/api/appointments",{
        credentials:"include"
      })

      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to load total appointments","error");
      }
      setAppointments(data);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  const fetchPatientProfile=async()=>{
    const res=await fetch("http://localhost:5000/api/auth/me",{
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

  useEffect(()=>{
    fetchPatientProfile();
    fetchAppointments();
    fetchMedicalRecords();
  },[]);

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  const upcomingAppointments=appointments.filter((appointment:any)=>{
    return(
      appointment.status!=="CANCELLED" && new Date(appointment.datetime) >= new Date()
    );
  });

  const nextAppointment=upcomingAppointments.length>0?upcomingAppointments[0]:null;

  return (
    <div className='bg-gray-100 flex min-h-screen'>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}
      {/* sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 lg:block`}>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold mb-8 '>Medi<span className='text-green-600'>Track</span></h1>
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
        {/*Welcome section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Welcome, {profile?.name}</h1>
          <p className='mt-4'>Manage appointments and medical records</p>
        </div>
        {/*Stats section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Total Appointments</h3>
            <p className='text-3xl font-bold mt-2'>{appointments.length}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Upcoming Appointments</h3>
            <p className='text-3xl font-bold mt-2'>{upcomingAppointments.length}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Medical Records</h3>
            <p className='text-3xl font-bold mt-2'>{recordCount}</p>
          </div>
        </div>
        {/*Upcoming appointment*/}
        <div className='bg-white p-6 rounded-lg shadow mb-8'>
          <h3 className='text-xl font-semibold mb-4'>Upcoming Appointment</h3>
          {nextAppointment?(
            <>
            <p><b>Doctor:</b>{" "}{nextAppointment?.name}</p>
            <p><b>Date:</b>{" "}{nextAppointment?new Date(nextAppointment.datetime).toLocaleDateString():"No upcoming appointments"}</p>
            <p><b>Time:</b>{" "}{nextAppointment?new Date(nextAppointment.datetime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"-"}</p>
            <p><b>Status:</b>{" "}{nextAppointment?.status}</p>
            </>
          ):(
            <p className='text-gray-500'>You don't have any upcoming appointments</p>
          )}
        </div>
        {/*Quick Actions */}
        <div className='bg-white p-6 shadow rounded'>
          <h3 className='text-xl'>Quick Actions</h3>
          <div className='flex flex-wrap gap-4'>
           <Link href='/dashboard/patient/appointments/book' className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'>Book Appointment</Link> 
           <Link href='/dashboard/patient/appointments' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>My Appointments</Link> 
           <Link href='/dashboard/patient/records' className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700'>Medical Records</Link> 
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

export default PatientDashboard