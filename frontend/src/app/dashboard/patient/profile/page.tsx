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
  const [formData,setFormData]=useState({name:"",email:""})
  const fetchPatientProfile=async()=>{
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
      setFormData({
        name:data.user.name,
        email:data.user.email
      })
    }catch(err){
      console.error(err);
      alert("Something went wrong");
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
      const res=await fetch(`http://localhost:5000/api/auth/me`,{
        method:"PATCH",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      alert(data.message);
      setProfile(data.user);
      setFormData({
        name:data.user.name,
        email:data.user.email
      })
      setEditMode(false);
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <div className='bg-gray-100 min-h-screen flex overflow-x-hidden w-full'>
      <aside className='hidden lg:block w-64 bg-white shadow min-h-screen p-6'>
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
      <main className='flex-1 p-2 md:p-8 min-w-0'>
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
    </div>
  )
}

export default PatientProfile