"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AdminRecords = () => {
  const {logout}=useAuth();
  const router=useRouter();
  const [profile,setProfile]=useState<any>(null);
  const [records,setRecords]=useState<any[]>([]);
  const [loading,setLoading]=useState<boolean>(true);
  const [search,setSearch]=useState<string>("");

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

  const fetchRecords=async()=>{
    try{
      const res=await fetch("http://localhost:5000/api/admin/records",{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      setRecords(data);
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchProfile();
    fetchRecords();
  },[]);

  const filteredRecords=records.filter((record)=>{
    return (
      record.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      record.patient_email.toLowerCase().includes(search.toLowerCase()) ||
      record.description.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleDelete=async(id:string)=>{
    const confirmDelete=window.confirm("Delete Are you sure you want to delete this record?");
    if(!confirmDelete){
      return;
    }
    try{
      const res=await fetch(`http://localhost:5000/api/admin/records/${id}`,{
        method:"DELETE",
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      alert(data.message);
      fetchRecords();
    }catch(err){
      console.error(err);
    }
  }

  const handleView=async(id:string)=>{
    try{
      const res=await fetch(`http://localhost:5000/api/admin/records/${id}`,{
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      window.open(data.url,"_blank");
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  return (
    <div className='bg-gray-100 flex h-dvh overflow-hidden'>
      <aside className='hidden lg:block min-h-screen bg-white w-64 p-6 shadow'>
        <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
        <nav className='space-y-4'>
          <Link href="/dashboard/admin" className='block font-bold p-2 rounded hover:bg-green-200'>Admin Dashboard</Link>
          <Link href="/dashboard/admin/users" className='block font-bold p-2 rounded hover:bg-green-200'>Users</Link>
          <Link href="/dashboard/admin/create-doctor" className='block font-bold p-2 rounded hover:bg-green-200'>Create Doctor</Link>
          <Link href="/dashboard/admin/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/admin/records" className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
          <Link href="/dashboard/admin/audit-logs" className='block font-bold p-2 rounded hover:bg-green-200'>Audit Logs</Link>
          <Link href="/dashboard/admin/analytics" className='block font-bold p-2 rounded hover:bg-green-200'>Analytics</Link>
          <Link href="/dashboard/admin/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
          <button onClick={handleLogout} className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 p-8 min-h-screen bg-gray-100'>
        <h1 className='text-3xl font-bold mb-4'>Welcome,{" "}{profile?.name}</h1>
        <div className='bg-white shadow-lg rounded-lg p-6'>
          <h1 className='text-2xl font-bold mb-8'>Manage Medical Records</h1>
          <div className='mb-6'>
            <input type="text" 
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder='Search by Patient Name, Patient Email and Description...'
            className='w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600'
            />
          </div>
          <div className='hidden lg:block overflow-x-auto'>
            <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
              <thead className='bg-green-700 text-white'>
                <tr>
                  <th className='px-6 py-3 text-left'>Description</th>
                  <th className='px-6 py-3 text-left'>Uploaded At</th>
                  <th className='px-6 py-3 text-left'>Patient Name</th>
                  <th className='px-6 py-3 text-left'>Patient Email</th>
                  <th className='px-6 py-3 text-left'>Doctor Name</th>
                  <th className='px-6 py-3 text-left'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length===0?(
                  <tr>
                    <td colSpan={6} className='text-center py-6 text-gray-600'>No Records Found.</td>
                  </tr>
                ):(
                  filteredRecords.map((record)=>(
                    <tr key={record.id} className='border-b hover:bg-gray-50'>
                      <td className='px-6 py-4 font-medium'>{record.description}</td>
                      <td className='px-6 py-4 font-medium'>{new Date(record.uploadedat).toLocaleDateString()}</td>
                      <td className='px-6 py-4 font-medium'>{record.patient_name}</td>
                      <td className='px-6 py-4 font-medium'>{record.patient_email}</td>
                      <td className='px-6 py-4 font-medium'>{record.doctor_name}</td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2'>
                          <button onClick={()=>handleView(record.id)} className='bg-blue-700 text-white p-2 rounded hover:bg-blue-600 cursor-pointer'>View</button>
                          <button onClick={()=>handleDelete(record.id)} className='bg-red-700 text-white p-2 rounded hover:bg-red-600'>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/*Mobile and Tablet */}
          <div className='block lg:hidden space-y-4'>
            {filteredRecords.length===0?(
              <div className='bg-white rounded-lg shadow p-6 text-center text-gray-600'>
                No Records found
              </div>
            ):(
              filteredRecords.map((record)=>(
                <div key={record.id} className='bg-white p-2 rounded-xl shadow-md border border-gray-600'>
                  <div className='space-y-4'>
                    <div>
                      <p className='text-xs text-gray-600'>Description</p>
                      <p className="text-lg font-semibold">{record.description}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Uploaded At</p>
                      <p className="text-lg font-semibold">{new Date(record.uploadedat).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Patient Name</p>
                      <p className="text-lg font-semibold">{record.patient_name}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Patient Email</p>
                      <p className="text-lg font-semibold">{record.patient_email}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600'>Doctor Name</p>
                      <p className="text-lg font-semibold">{record.doctor_name}</p>
                    </div>
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                      <button onClick={()=>handleView(record.id)} className='bg-blue-700 text-white rounded-lg hover:bg-blue-600 cursor-pointer'>View</button>
                      <button onClick={()=>handleDelete(record.id)} className='bg-red-700 text-white rounded-lg hover:bg-red-600 cursor-pointer'>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminRecords