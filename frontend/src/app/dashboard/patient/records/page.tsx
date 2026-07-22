"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';

const PatientRecords = () => {
    const {logout}=useAuth();
    const router=useRouter();

    const fileInputRef=useRef<HTMLInputElement>(null)
    const [records,setRecords]=useState<any[]>([]);
    const [profile,setProfile]=useState<any>(null);
    const [selectedFile,setSelectedFile]=useState<File | null>(null);
    const [description,setDescription]=useState<string>("");
    const [uploadProgress,setUploadProgress]=useState<number>(0);
    const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

    useEffect(() => {
        document.title = "Patient Medical Records | MediTrack";
    },[]);

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
                alert(data.error);
                return;
            }
            setProfile(data.user);
            console.log(data);

        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }

    const fetchPatientRecords=async()=>{
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/records`,{
                credentials:"include"
            })

            const data=await res.json();
            if(!res.ok){
                alert(data.error);
                return;
            }
            setRecords(data);
            console.log(records);
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }
    
    useEffect(()=>{
        fetchPatientProfile();
        fetchPatientRecords();
    },[])

    const handleDelete=async(id:string)=>{
        const confirmDelete=window.confirm("Are you sure you want to delete this medical record?");
        if(!confirmDelete)
            return;
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/records/${id}`,{
                method:"DELETE",
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to delete record","error");
                return;
            }
            showToast("Record Deleted successfully","success");
            fetchPatientRecords();
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }

    const handleView=async(id:string)=>{
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/records/view/${id}`,{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to download record","error");
                return;
            }
            window.open(data.url,"_blank");
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }

    }

    const handleUpload=async()=>{
        if(!selectedFile){
            showToast("Please choose a file","warning");
            return;
        }

        if(!description.trim()){
            showToast("Please enter a description","warning");
            return;
        }

        const formData=new FormData();
        formData.append("record",selectedFile);
        formData.append("description",description);

        try{
            console.log("Starting upload...");
            console.log(selectedFile);
            console.log(description);
            const res=await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/records/upload`,
                formData,{
                    withCredentials:true,
                    onUploadProgress:(ProgressEvent)=>{
                        const percentCompleted=Math.round(
                            (ProgressEvent.loaded*100)/(ProgressEvent.total || 1)
                        )
                        setUploadProgress(percentCompleted);
                    }
                }
            )
            console.log(res.data);
            setUploadProgress(100);
            setTimeout(()=>{
                setSelectedFile(null);
                setDescription("");
                setUploadProgress(0);
                if(fileInputRef.current){
                    fileInputRef.current.value="";
                }
            },1000)
            showToast("Record Uploaded Successfully","success");
        fetchPatientRecords();
        }catch(err:any){
            console.error(err);
            console.log("========== UPLOAD ERROR ==========");
            console.log("Message:", err.message);
            console.log("Code:", err.code);
            console.log("Status:", err.response?.status);
            console.log("Response:", err.response?.data);
            console.log("Request:", err.request);
            console.log("Config:", err.config);
            showToast(err.response?.data?.error || "Something went wrong","error");
            
        }
    }

    const handleLogout=async()=>{
        await logout();
        router.push("/login");
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
                <Link href="/dashboard/patient" onClick={()=>setSidebarOpen(true)} className='block font-bold p-2 rounded hover:bg-green-200'>Patient Dashboard</Link>
                <Link href="/dashboard/patient/appointments" onClick={()=>setSidebarOpen(true)} className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
                <Link href="/dashboard/patient/records" onClick={()=>setSidebarOpen(true)} className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
                <Link href="/dashboard/patient/profile" onClick={()=>setSidebarOpen(true)} className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
                <Link href="/dashboard/patient/messages" onClick={()=>setSidebarOpen(true)} className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
                <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
            </nav>
        </aside>
        <main className='flex-1 md:p-8 lg:ml-64 p-4 overflow-x-auto'>
            <div className='lg:hidden mb-6'>
                <button onClick={()=>setSidebarOpen(true)} className='p-2 shadow cursor-pointer'>☰</button>
            </div>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold'>Hello, {profile?.name}</h1>
                <p className='mt-4'>Upload your medical records here</p>
                <div className="bg-white shadow rounded-lg p-6 mt-4">
                    <h2 className='text-2xl font-semibold mb-6'>Upload Medical Records</h2>
                    {/*File Input */}
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Choose File</label>
                        <input type="file" 
                        ref={fileInputRef}
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
                    <button onClick={handleUpload} className='w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer'>Upload</button>
                </div>
                <div className='bg-white shadow rounded-lg p-6 mt-8'>
                    <h1 className='text-2xl font-semibold mb-4'>Your Uploaded Records</h1>
                    {records.length===0?(
                        <p className="text-gray-500">No records uploaded yet.</p>
                    ):(
                        records.map((record:any)=>(
                            <div key={record.id} className='border rounded p-4 mb-4'>
                                <p className='text-2xl font-bold'>Description:{" "}<span className='font-normal'>{record.description}</span></p>
                                <p className='text-2xl font-bold'>Uploaded At:{" "}<span className='font-normal'>{new Date(record.uploadedat).toLocaleDateString()}</span></p>
                                <div className='mt-4 flex gap-2'>
                                    <button onClick={()=>handleView(record.id)} className='bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer'>View</button>
                                    <button onClick={()=>handleDelete(record.id)} className='bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Delete</button>
                                </div>
                            </div>
                        ))
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

export default PatientRecords