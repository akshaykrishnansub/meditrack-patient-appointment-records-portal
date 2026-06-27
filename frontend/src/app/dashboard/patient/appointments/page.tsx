"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const Appointment = () => {
  const {logout}=useAuth();
  const router=useRouter();


  return (
    <div className='bg-gray-100 flex'>
      <aside className='bg-white w-64 min-h-screen shadow p-6'>
        <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
        <nav className='space-y-4'>
          <Link href="/dashboard/patient" className='block font-bold p-2 rounded hover:bg-green-200'>Patient Dashboard</Link>
          <Link href="/dashboard/patient/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/patient/records" className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
          <Link href="/dashboard/patient/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
          <Link href="/dashboard/patient/messages" className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
          <button className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 p-8'>
        <h1 className='text-3xl'>My Appointments</h1>
        <div className='mt-4'>
          <Link href="/dashboard/patient/appointments/book" className='text-white font-bold text-xl px-4 py-2 bg-green-900 rounded'>+ Book Appointment</Link>
        </div>
          <div className='bg-white mb-8 p-6 mt-6'>
            <p className='text-xl font-bold mt-2'>Doctor Name: <span className='font-normal'>Dr. Mohan</span></p>
            <p className='text-xl font-bold mt-2'>Date of Appointment: <span className='font-normal'>28-07-2026</span></p>
            <p className='text-xl font-bold mt-2'>Time of Appointment: <span className='font-normal'>10:00 AM</span></p>
            <p className='text-xl font-bold mt-2'>Appointment Status: <span className='text-yellow-800 font-normal'>PENDING</span></p>
            <button className='mt-4 text-white bg-red-600 hover:bg-red-500 px-4 py-2'>Cancel Appointment</button>
          </div>
      </main>
    </div>
  )
}

export default Appointment