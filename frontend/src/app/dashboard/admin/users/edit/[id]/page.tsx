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
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);
  const {logout}=useAuth();

  useEffect(() => {
    document.title = "Admin Edit User | MediTrack";
  },[]);

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

  const fetchProfile=async()=>{
    try{
      const res=await fetch("http://localhost:5000/api/auth/me",{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to fetch profile","error");
        return;
      }
      setProfile(data.user);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
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
        showToast(data.error || "Failed to fetch user details","error");
        return;
      }
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
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
        showToast(data.error || "Failed to submit new details","error");
        return;
      }
      showToast(data.message,"success");
      router.push('/dashboard/admin/users');
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
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
    <div className='bg-gray-100 flex min-h-screen'>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 lg:block`}>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold mb-8 '>Medi<span className='text-green-600'>Track</span></h1>
          <button className="lg:hidden" onClick={()=>setSidebarOpen(false)}>X</button>
        </div>
        <nav className='space-y-4'>
          <Link href="/dashboard/admin" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Admin Dashboard</Link>
          <Link href="/dashboard/admin/users" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Users</Link>
          <Link href="/dashboard/admin/create-doctor" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Create Doctor</Link>
          <Link href="/dashboard/admin/appointments" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/admin/records" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
          <Link href="/dashboard/admin/audit-logs" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Audit Logs</Link>
          <Link href="/dashboard/admin/profile" onClick={()=>setSidebarOpen(false)} className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 md:p-8 lg:ml-64 p-4 overflow-x-auto'>
        <div className='lg:hidden mb-6'>
          <button onClick={()=>setSidebarOpen(true)} className='p-2 shadow cursor-pointer'>☰</button>
        </div>
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
              required
              />
              <label htmlFor="email" className='block mt-2 mb-2 font-semibold'>Email</label>
              <input type="email"
              value={email}
              onChange={(e)=>setName(e.target.value)}
              className='w-full mb-2 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 rounded'
              required
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
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default EditUser