"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const PatientRecords = () => {
    const {logout}=useAuth();
    const router=useRouter();

    const [profile,setProfile]=useState<any>(null);
    const [selectedFile,setSelectedFile]=useState<File | null>(null);
    const [description,setDescription]=useState<string>("");
    const [uploadProgress,setUploadProgress]=useState<number>(0);

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
            console.log(data);

        }catch(err){
            console.error(err);
            alert("Something went wrong");
        }
    }
    
    useEffect(()=>{
        fetchPatientProfile();
    },[])

    const handleLogout=async()=>{
        await logout();
        router.push("/login");
    }
    
    return (
    <div className='bg-gray-100 flex'>
        <aside className="hidden lg:block min-h-screen w-64 bg-white shadow-md p-6">
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
        <main className='flex-1 p-8 min-h-screen'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold'>Hello, {profile?.name}</h1>
                <p className='mt-4'>Upload your medical records here</p>
                <div className="bg-white shadow rounded-lg p-6 mt-4">
                    <h2 className='text-2xl font-semibold mb-6'>Upload Medical Records</h2>
                    {/*File Input */}
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Choose File</label>
                        <input type="file" 
                        accept='.pdf,.jpg,.jpeg,.png' 
                        onChange={(e)=>{
                            if(e.target.files){
                                setSelectedFile(e.target.files[0]);
                            }
                        }}
                        className='border rounded p-2 w-full bg-gray-400'/>
                    </div>
                    {/*Description*/}
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>
                            Description
                        </label>
                        <textarea 
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        className='border rounded p-2 w-full' rows={4} placeholder='Enter Description'/>
                    </div>
                    {/*Upload Progress*/}
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Upload Progress</label>
                        <progress
                        value={uploadProgress}
                        max={100}
                        className='w-full'
                        />
                        <p className='text-sm text-gray-700 mt-1'>{uploadProgress}%</p>
                    </div>
                    {/*Upload Button */}
                    <button className='w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer'>Upload</button>
                </div>
                <div className='bg-white shadow rounded-lg p-6 mt-8'>
                    <h1 className='text-2xl font-semibold mb-4'>Your Uploaded Records</h1>
                    <p className="text-gray-500">No records uploaded yet.</p>
                </div>
            </div>
        </main>
    </div>
  )
}

export default PatientRecords