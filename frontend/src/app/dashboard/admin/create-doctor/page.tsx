"use client"
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CreateDoctor = () => {
    const router=useRouter();
    const {logout}=useAuth();
    const [loading,setLoading]=useState<boolean>(false);
    const [profile,setProfile]=useState<any>(null);
    const [name,setName]=useState<string>("");
    const [email,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

    useEffect(() => {
        document.title = "Admin Create Doctor | MediTrack";
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
            showToast("Something went wrong");
        }
    }

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const res=await fetch("http://localhost:5000/api/admin/doctor",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({name,email,password})
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to submit new doctor details","error");
                return;
            }
            showToast("Doctor created successfully","success");
            setName("");
            setEmail("");
            setPassword("");
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchProfile();
    })

    const handleLogout=async()=>{
        await logout();
        router.push('/login');
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
      <main className='min-h-screen p-8 flex-1 bg-gray-100'>
        <h1 className='text-3xl font-bold mb-4'>Welcome,{" "}{profile?.name}</h1>
        <p className='text-md font-medium text-black mb-8'>You can create doctor profiles here.</p>
        <div className='bg-white shadow-lg rounded-lg p-8'>
            <h1 className='text-2xl font-bold mb-6'>Create Doctor</h1>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                    <label htmlFor="doctorName" className='block mb-2 font-semibold'>Doctor Name</label>
                    <input type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="doctorEmail" className='block mb-2 font-semibold'>Email</label>
                    <input type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="temporaryPassword" className='block mb-2 font-semibold'>Temporary Password</label>
                    <input type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div>
                    <button type="submit" disabled={loading} className='w-full bg-green-700 px-4 py-2 text-white hover:bg-green-600 cursor-pointer'>{loading?"Creating the doctor":"Create Doctor"}</button>
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

export default CreateDoctor