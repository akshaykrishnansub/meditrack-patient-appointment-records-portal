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

    const handleDelete=async(id:string)=>{
        const confirmDelete=window.confirm("Are you sure you want to delete this user?");
        if(!confirmDelete){
            return;
        }
        try{
            const res=await fetch(`http://localhost:5000/api/admin/users/${id}`,{
                method:"DELETE",
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                alert(data.error);
                return;
            }
            alert(data.message);
            fetchUsers();
        }catch(err){
            console.error(err);
            alert("Something went wrong");
        }
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
                alert(data.error);
                return;
            }
            setProfile(data.user);
        }catch(err){
            console.error(err);
            alert("Something went wrong");
        }
    }

    const fetchUsers=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/admin/users",{
                credentials:"include"
            })
            const data=await res.json();
            if(!res.ok){
                alert(data.error);
                return;
            }
            setUsers(data);
        }catch(err){
            console.error(err);
            alert("Something went wrong");
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
    <div className='bg-gray-100 flex'>
        <aside className='hidden lg:block min-h-screen bg-white shadow-md w-64 p-6'>
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
            <h1 className='text-3xl font-bold mb-8'>Welcome,{" "}{profile?.name}</h1>
            <div className='bg-white shadow-lg rounded-lg p-6'>
                <h1 className='text-3xl font-bold mb-6'>Manage Users</h1>
                <div className='mb-6'>
                    <input type="text"
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    placeholder='Search by name or email...'
                    className='w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600'
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
                                        <p className="text-lg font-semibold">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Email</p>
                                        <p className="text-lg font-semibold">{user.email}</p>
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
    </div>
  )
}

export default AdminUsers;