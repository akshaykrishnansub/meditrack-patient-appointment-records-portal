"use client"
import { useAuth } from '@/context/AuthContext';
import { discoverValidationDepths } from 'next/dist/server/app-render/instant-validation/instant-validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AdminAppointmentManagement = () => {
  const {logout}=useAuth();
  const router=useRouter();
  const [appointments,setAppointments]=useState<any[]>([]);
  const [filteredAppointments,setFilteredAppointments]=useState<any[]>([]);
  const [search,setSearch]=useState<string>("");
  const [loading,setLoading]=useState<boolean>(true);
  const [profile,setProfile]=useState<any>(null);
  const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
  const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

  useEffect(() => {
    document.title = "Admin Appointment Management | MediTrack";
  },[]);

  const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }


  const fetchProfile=async()=>{
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to fetch admin Profile","error");
                return;
            }
            setProfile(data.user);
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }
    }

  const fetchAppointments=async()=>{
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/appointments`,{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        showToast(data.error || "Failed to fetch appointment details","error");
        return;
      }
      setAppointments(data);
      setFilteredAppointments(data);
    }catch(err){
      console.error(err);
      showToast("Something went wrong","error");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchProfile();
    fetchAppointments();
  },[]);

  useEffect(()=>{
    const filtered=appointments.filter((appointment)=>
    appointment.patient_name.toLowerCase().includes(search.toLowerCase()) ||
    appointment.doctor_name.toLowerCase().includes(search.toLowerCase()));
    setFilteredAppointments(filtered);
  },[search,appointments])

  const handleLogout=async()=>{
    await logout();
    router.push('/login');
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
        <div className='bg-white shadow-lg rounded-lg p-6 mt-4'>
          <h1 className='text-2xl font-bold mb-6'>Manage Appointments</h1>
          <div className='mb-6'>
            <input type="text"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder='Search by patient name or doctor name...'
            className='w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600'
            />
          </div>
          <div className='hidden lg:block overflow-x-auto'>
            <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
              <thead className='bg-green-700 text-white'>
                <tr>
                  <th className='px-6 py-3 text-left'>Patient Name</th>
                  <th className='px-6 py-3 text-left'>Doctor Name</th>
                  <th className='px-6 py-3 text-left'>Date</th>
                  <th className='px-6 py-3 text-left'>Time</th>
                  <th className='px-6 py-3 text-left'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length===0?(
                  <tr>
                    <td colSpan={5} className='text-center py-6 text-gray-500'>No Appointments found.</td>
                  </tr>
                ):(
                  filteredAppointments.map((appointment)=>(
                    <tr key={appointment.id} className='border-b hover:bg-gray-50'>
                      <td className='px-6 py-4 text-left'>{appointment.patient_name}</td>
                      <td className='px-6 py-4 text-left'>{appointment.doctor_name}</td>
                      <td className='px-6 py-4 text-left'>{new Date(appointment.datetime).toLocaleDateString()}</td>
                      <td className='px-6 py-4 text-left'>{new Date(appointment.datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</td>
                      <td className='px-6 py-4 text-left'>
                        {appointment.status==="RESCHEDULED"&&(<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold'>RESCHEDULED</span>)}
                        {appointment.status==="APPROVED"&&(<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>APPROVED</span>)}
                        {appointment.status==="CANCELLED"&&(<span className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold'>CANCELLED</span>)}
                        {appointment.status==="PENDING"&&(<span className='bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold'>PENDING</span>)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className='block lg:hidden space-y-4'>
            {filteredAppointments.length===0?(
              <div className='bg-white rounded-lg shadow p-6 text-center text-gray-500'>No Appointments found</div>
            ):(
              filteredAppointments.map((appointment)=>(
                <div key={appointment.id} className='bg-white p-2 rounded-xl shadow-md border border-gray-600'>
                  <div className='space-y-4'>
                    <div>
                      <p className='text-xs text-gray-600'>Patient Name</p>
                      <p className='text-lg font-bold'>{appointment.patient_name}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Doctor Name</p>
                      <p className='text-lg font-bold'>{appointment.doctor_name}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Date</p>
                      <p className='text-lg font-bold'>{new Date(appointment.datetime).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Date</p>
                      <p className='text-lg font-bold'>{new Date(appointment.datetime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Status</p>
                      {appointment.status==="RESCHEDULED"&&(<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold'>RESCHEDULED</span>)}
                      {appointment.status==="APPROVED"&&(<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>APPROVED</span>)}
                      {appointment.status==="CANCELLED"&&(<span className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold'>CANCELLED</span>)}
                      {appointment.status==="PENDING"&&(<span className='bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold'>PENDING</span>)}
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

export default AdminAppointmentManagement