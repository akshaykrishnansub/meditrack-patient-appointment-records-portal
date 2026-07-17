"use client"
import { useAuth } from '@/context/AuthContext';
import { Params } from 'next/dist/server/request/params';
import Link from 'next/link';
import { useParams,useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const EditUser = () => {
  const {id}=useParams();
  const router=useRouter();
  const [profile,setProfile]=useState<any>(null);
  const [name,setName]=useState<string>("");
  const [email,setEmail]=useState<string>("");
  const [role,setRole]=useState<string>("");
  const [loading,setLoading]=useState<boolean>(true);
  const {logout}=useAuth();

  useEffect(() => {
                  document.title = "Admin Edit User | MediTrack";
                },[]);

  const fetchProfile=async()=>{
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

  const handleLogout=async()=>{
    await logout();
    router.push('/login');
  }

  const fetchUser=async()=>{
    try{
      const res=await fetch(`http://localhost:5000/api/admin/users/${id}`,{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }finally{
      setLoading(false);
    }
  }

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    try{
      const res=await fetch(`http://localhost:5000/api/admin/users/${id}`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({name,email})
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      alert(data.message);
      router.push('/dashboard/admin/users');
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  useEffect(()=>{
    fetchProfile();
    console.log(id);
    if(id){
      fetchUser();
    }
  },[id]);

  if(loading){
    return <p className='p-8'>Loading...</p>
  }

  return (
    <div className='bg-gray-100 flex'>
      <aside className='hidden lg:block min-h-screen bg-white w-64 shadow-md p-6'>
        <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
        <nav className='space-y-4'>
          <Link href="/dashboard/admin" className='block font-bold p-2 rounded hover:bg-green-200'>Admin Dashboard</Link>
          <Link href="/dashboard/admin/users" className='block font-bold p-2 rounded hover:bg-green-200'>Users</Link>
          <Link href="/dashboard/admin/create-doctor" className='block font-bold p-2 rounded hover:bg-green-200'>Create Doctor</Link>
          <Link href="/dashboard/admin/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/admin/records" className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
          <Link href="/dashboard/admin/audit-logs" className='block font-bold p-2 rounded hover:bg-green-200'>Audit Logs</Link>
          <Link href="/dashboard/admin/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 bg-gray-100 min-h-screen p-8'>
        <h1 className='text-3xl font-bold'>Welcome,{" "}{profile?.name}</h1>
        <div className="bg-white w-full p-8 mt-4">
          <h1 className='text-2xl font-bold mb-6'>Update User</h1>
          <form className='space-y-6'>
            <div>
              <label htmlFor="name" className='block mb-2 font-semibold'>Name</label>
              <input type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className='w-full px-4 py-2 mb-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 rounded'
              />
              <label htmlFor="email" className='block mt-2 mb-2 font-semibold'>Email</label>
              <input type="email"
              value={email}
              onChange={(e)=>setName(e.target.value)}
              className='w-full mb-2 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 rounded'
              />
              <label htmlFor="name" className='block mb-2 font-semibold'>Role</label>
              <input type="text"
              value={role}
              readOnly
              onChange={(e)=>setName(e.target.value)}
              className='w-full px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none cursor-not-allowed focus:ring-2 focus:ring-green-600 rounded'
              />
              <button onClick={handleSubmit} className='bg-green-700 text-white px-4 py-2 w-full mt-6 cursor-pointer hover:bg-green-600'>Update User</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EditUser