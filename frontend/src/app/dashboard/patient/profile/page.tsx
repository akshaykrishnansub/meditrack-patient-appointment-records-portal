"use client"
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const PatientProfile = () => {

  const {logout}=useAuth();
  const router=useRouter();
  const [profile,setProfile]=useState<any>(null);
  const [editMode,setEditMode]=useState<boolean>(false);
  const [formData,setFormData]=useState({name:"",email:""});
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchPatientProfile=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to fetch patient Profile","error");
        return;
      }
      setProfile(data.user);
      setFormData({
        name:data.user.name,
        email:data.user.email
      })
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  useEffect(()=>{
    fetchPatientProfile();
  },[]);

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  useEffect(() => {
    document.title = "Patient Profile | MediTrack";
  },[]);

  const handleSave=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
        method:"PATCH",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to save new data","error");
        return;
      }
      showToast(data.message,"success");
      setProfile(data.user);
      setFormData({
        name:data.user.name,
        email:data.user.email
      })
      setEditMode(false);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex'>
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
        <h1 className='text-3xl font-bold'>Welcome,{" "}{profile?.name}</h1>
        <div className='bg-white mt-6 p-3 md:p-8 shadow rounded-lg '>
          <h2 className='text-2xl font-bold'>Personal Information</h2>
          <div className='mt-6'>
            <p className='text-xl font-semibold'>Name:</p>
            {editMode?(
              <input 
              value={formData.name}
              onChange={(e)=>setFormData({
                ...formData,
                name:e.target.value})}
                className='w-full border border-gray-300 focus:outline-none px-4 py-2 focus:ring-2 focus:ring-green-600'
              />
            ):(
              <p className='text-xl font-medium'>{profile?.name}</p>)}
          </div>
          <div className='mt-6'>
            <p className='text-xl font-semibold'>Email:</p>
            {editMode?(
              <input 
              value={formData.email}
              onChange={(e)=>setFormData({
                ...formData,
                email:e.target.value})}
                className='w-full border border-gray-300 focus:outline-none px-4 py-2 focus:ring-2 focus:ring-green-600'
              />
            ):(
              <p className='text-xl font-medium'>{profile?.email}</p>)}
          </div>
          <div className='mt-6'>
            <p className='text-xl font-semibold'>Role:</p>
            <p className='text-xl font-medium'>{profile?.role}</p>
          </div>
          <div className='flex gap-2 mt-4'>
            <button onClick={()=>setEditMode(!editMode)} className='bg-green-700 text-white px-3 py-2 rounded hover:bg-green-600 cursor-pointer'>{editMode?"Cancel":"Update Profile"}</button>
            {editMode && (
              <button onClick={handleSave} className='bg-blue-700 text-white px-3 py-2 rounded hover:bg-blue cursor-pointer'>Save Changes</button>
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

export default PatientProfile