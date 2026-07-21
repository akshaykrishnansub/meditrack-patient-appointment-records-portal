"use client"
import { useAuth } from '@/context/AuthContext';
import { Span } from 'next/dist/trace';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AdminUsers = () => {
    const {logout}=useAuth();
    const router=useRouter();
    const [profile,setProfile]=useState<any>(null);
    const [users,setUsers]=useState<any[]>([]);
    const [loading,setLoading]=useState<boolean>(true);
    const [searchTerm,setSearchTerm]=useState<string>("");
    const [sidebarOpen,setSidebarOpen]=useState<boolean>(false);
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

    useEffect(() => {
        document.title = "Admin User Listing | MediTrack";
    },[]);

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

    const handleDelete=async(id:string)=>{
        const confirmDelete=window.confirm("Are you sure you want to delete this user?");
        if(!confirmDelete){
            return;
        }
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`,{
                method:"DELETE",
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to delete user","error");
                return;
            }
            showToast(data.message,"success");
            fetchUsers();
        }catch(err){
            console.error(err);
            showToast("Something went wrong","success");
        }
    }


    const handleLogout=async()=>{
        await logout();
        router.push("/login");
    }

    const fetchProfile=async()=>{
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{
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

    const fetchUsers=async()=>{
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                showToast(data.error || "Failed to fetch user details","error");
                return;
            }
            setUsers(data);
        }catch(err){
            console.error(err);
            showToast("Something went wrong","error");
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchProfile();
        fetchUsers();
    },[]);

    const filteredUsers=users.filter((user)=>{
        return (
            user.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
    });

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
            <h1 className='text-3xl font-bold mb-8'>Welcome,{" "}{profile?.name}</h1>
            <div className='bg-white shadow-lg rounded-lg p-6'>
                <h1 className='text-3xl font-bold mb-6'>Manage Users</h1>
                <div className='mb-6'>
                    <input type="text"
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    placeholder='Search by name or email...'
                    className='w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600'
                    required
                    />
                </div>
                <div className='hidden lg:block overflow-x-auto'>
                    <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
                        <thead className='bg-green-700 text-white'>
                            <tr>
                                <th className='px-6 py-3 text-left'>Name</th>
                                <th className='px-6 py-3 text-left'>Email</th>
                                <th className='px-6 py-3 text-left'>Role</th>
                                <th className='px-6 py-3 text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length===0?(
                                <tr>
                                    <td colSpan={4} className='text-center py-6 text-gray-500'>
                                        No Users Found.
                                    </td>
                                </tr>
                            ):(
                                filteredUsers.map((user)=>(
                                    <tr key={user.id} className='border-b hover:bg-gray-50'>
                                        <td className='px-6 py-4 font-medium'>{user.name}</td>
                                        <td className='px-6 py-4'>{user.email}</td>
                                        <td className='px-6 py-4'>
                                            {user.role==="PATIENT" &&(<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold'>PATIENT</span>)}
                                            {user.role==="DOCTOR" &&(<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>DOCTOR</span>)}
                                            {user.role==="ADMIN" &&(<span className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold'>ADMIN</span>)}
                                        </td>
                                        <td className='px-6 py-4 text-left flex gap-2'>
                                            <button onClick={()=>handleDelete(user.id)} className='bg-red-600 text-white px-4 py-2 hover:bg-red-700 rounded transition cursor-pointer'>Delete</button>
                                            <button onClick={()=>router.push(`/dashboard/admin/users/edit/${user.id}`)} className='bg-green-900 text-white px-4 py-2 hover:bg-green-800 rounded transition cursor-pointer'>Update</button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
                {/*Mobile and Tablet*/}
                <div className='block lg:hidden space-y-4'>
                    {filteredUsers.length===0?(
                        <div className='bg-white rounded-lg shadow p-6 text-center text-gray-500'>
                            No users found
                        </div>
                    ):(
                        filteredUsers.map((user)=>(
                            <div key={user.id} className='bg-white p-2 rounded-xl shadow-md border border-gray-600'>
                                <div className='space-y-4'>
                                    <div>
                                        <p className='text-xs text-gray-600'>Name</p>
                                        <p className="text-xs font-semibold">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Email</p>
                                        <p className="text-xs font-semibold">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Role</p>
                                        {user.role==="PATIENT" && (<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold'>PATIENT</span>)}
                                        {user.role==="DOCTOR" && (<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>DOCTOR</span>)}
                                        {user.role==="ADMIN" && (<span className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold'>ADMIN</span>)}
                                    </div>
                                    <div className='grid grid-cols-2 gap-3 pt-2'>
                                        <button onClick={()=>handleDelete(user.id)} className='bg-red-700 text-white rounded-lg hover:bg-red-600 cursor-pointer'>Delete</button>
                                        <button onClick={()=>router.push(`/dashboard/admin/users/edit/${user.id}`)} className='bg-green-700 text-white rounded-lg hover:bg-green-600 cursor-pointer'>Update</button>
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

export default AdminUsers;