"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Admin = () => {
  const {logout}=useAuth();
  const router=useRouter();
  const [profile,setProfile]=useState<any>(null);
  const [stats,setStats]=useState<any>(null);

  const fetchDashboardStats=async()=>{
    try{
      const res=await fetch("http://localhost:5000/api/admin/dashboard",{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      setStats(data);
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

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

    useEffect(()=>{
      fetchProfile();
      fetchDashboardStats();
    },[])

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  return (
    <div className='bg-gray-100 flex min-h-screen w-full overflow-x-hidden'>
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
      <main className='flex-1 md:p-8 p-4 min-w-0'>
        {/*Welcome section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Welcome,{" "}{profile?.name}</h1>
          <p className='mt-4'>Manage Doctors, Users, Manage Records, Systems Logs</p>
        </div>
        {/*Statistics Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Total Users</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.totalUsers ?? 0}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Total Doctors</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.totalDoctors ?? 0}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Total Appointments</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.totalAppointments ?? 0}</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Total Medical Records</h3>
            <p className='text-3xl font-bold mt-2'>{stats?.totalRecords ?? 0}</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow mb-8'>
          <h3 className='text-2xl font-bold'>Recent Activity</h3>
          {stats?.recentActivity?.length===0?(
            <p>No Recent Activity</p>
          ):(
            stats?.recentActivity?.map((log:any)=>(
              <div key={log.id} className='py-3'>
                <p className='font-semibold'>{log.action}</p>
                <p className='text-gray-600'>{log.details}</p>
              </div>
            ))
          )}
        </div>
        <div className='bg-white p-6 shadow rounded-lg mb-8'>
          <h3 className='text-2xl font-bold'>Quick Actions</h3>
          <div className='mt-4 flex flex-col lg:flex-row gap-2'>
            <button className='text-white font-bold px-4 py-2 rounded bg-green-700 hover:bg-green-600'>Create Doctor</button>
            <button className='text-white font-bold px-4 py-2 rounded bg-blue-700 hover:bg-blue-600'>Manage Users</button>
            <button className='text-white font-bold px-4 py-2 rounded bg-purple-700 hover:bg-purple-600'>View Logs</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admin