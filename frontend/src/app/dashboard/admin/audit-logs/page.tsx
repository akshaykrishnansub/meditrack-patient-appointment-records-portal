"use client"
import { useAuth } from '@/context/AuthContext';
import { Span } from 'next/dist/trace';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AuditLogs = () => {
    const {logout}=useAuth();
    const router=useRouter();
    const [profile,setProfile]=useState<any>(null);
    const [logs,setLogs]=useState<any[]>([]);
    const [loading,setLoading]=useState<boolean>(true);
    const [search,setSearch]=useState<string>("");
    const [filteredLogs,setFilteredLogs]=useState<any[]>([]);
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

    useEffect(() => {
        document.title = "Admin Audit Logs | MediTrack";
    },[]);

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

    const handleLogout=async()=>{
        await logout();
        router.push("/login");
    }

    const fetchProfile=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/auth/me",{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to fetched profile","error");
                return;
            }
            setProfile(data.user);
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }

    const fetchLogs=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/audit",{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to fetch Logs","error");
                return;
            }
            setLogs(data);
            setFilteredLogs(data);
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchProfile();
        fetchLogs();
    },[]);

    useEffect(()=>{
      const filtered=logs.filter((log)=>
        (log.action ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (log.details ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (log.name ?? "").toLowerCase().includes(search.toLowerCase())
      );
      setFilteredLogs(filtered);
    },[search,logs])

  return (
    <div className='bg-gray-100 flex min-h-screen w-full overflow-x-hidden'>
        <aside className='hidden lg:block min-h-screen bg-white shadow-md w-64 p-6'>
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
        <main className='flex-1 md:p-8 p-4 min-w-0'>
            <h1 className='text-3xl font-bold mb-8'>Welcome,{" "}{profile?.name}</h1>
            <div className='bg-white shadow-lg rounded-lg p-6'>
                <h1 className='text-3xl font-bold mb-6'>View audit Logs</h1>
                <div className='mb-6'>
                    <input type="text"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder='Search Audit Logs...'
                    className='w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div className='hidden lg:block overflow-x-auto'>
                    <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
                        <thead className='bg-green-700 text-white'>
                            <tr>
                                <th className='px-6 py-3 text-left'>User</th>
                                <th className='px-6 py-3 text-left'>Action</th>
                                <th className='px-6 py-3 text-left'>Details</th>
                                <th className='px-6 py-3 text-left'>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length===0?(
                                <tr>
                                    <td colSpan={4} className='text-center py-6 text-gray-500'>
                                        No Audit Logs found..
                                    </td>
                                </tr>
                            ):(
                                filteredLogs.map((log)=>(
                                    <tr key={log.id} className='border-b hover:bg-gray-50'>
                                        <td className='px-6 py-4 font-medium'>{log.name}</td>
                                        <td className='px-6 py-4'>{log.action}</td>
                                        <td className='px-6 py-4'>{log.details}</td>
                                        <td className='px-6 py-4'>{new Date(log.createdat).toLocaleString()}</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
                {/*Mobile and Tablet*/}
                <div className='block lg:hidden space-y-4'>
                    {filteredLogs.length===0?(
                        <div className='bg-white rounded-lg shadow p-6 text-center text-gray-500'>
                            No users found
                        </div>
                    ):(
                        filteredLogs.map((log)=>(
                            <div key={log.id} className='bg-white p-2 rounded-xl shadow-md border border-gray-600'>
                                <div className='space-y-4'>
                                    <div>
                                        <p className='text-xs text-gray-600'>User</p>
                                        <p className="text-xs font-semibold">{log.name}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Action</p>
                                        <p className="text-xs font-semibold">{log.action}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Details</p>
                                        <p className="text-xs font-semibold">{log.details}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Date</p>
                                        <p className="text-xs font-semibold">{new Date(log.createdat).toLocaleString()}</p>
                                    </div>
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

export default AuditLogs;