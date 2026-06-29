"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const BookAppointment = () => {
  const {logout}=useAuth();
  const router=useRouter();

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  return (
    <div className='bg-gray-100 flex'>
        <aside className='min-h-screen bg-white w-64 shadow p-6 '>
            <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
            <nav className='space-y-4'>
                <Link href="/dashboard/patient" className='block font-bold p-2 rounded hover:bg-green-200'>Dashboard</Link>
                <Link href="/dashboard/patient/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
                <Link href="/dashboard/patient/records" className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
                <Link href="/dashboard/patient/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
                <Link href="/dashboard/messages" className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
                <button onClick={handleLogout} className='bg-red-500 mt-auto text-white font-bold px-4 py-2 hover:bg-red-600 cursor-pointer rounded'>Logout</button>
            </nav>
        </aside>
        <main className='flex-1 p-8'>
          <h3 className='text-3xl font-bold'>Book Your Appointment Here</h3>
          <div className='bg-white p-6 mb-8 rounded shadow mt-4 '>
            {/*Doctor*/}
            <div className='mb-6'>
              <label className='block font-semibold mb-2'>Select Doctor</label>
              <select className='w-full border border-gray-300 rounded p-3'>
                <option>Select Doctor</option>
                <option>Dr. Mohan</option>
                <option>Dr. Rahul</option>
                <option>Dr. Kumar</option>
              </select>
              {/*Date */}
              <div className='mb-6'>
                <label className='block font-semibold mb-2 mt-4'>Appointment Date</label>
                <input type="date" className='w-full border border-gray-300 rounded p-3'/>
              </div>
              <div className='mb-6'>
                <label className='block font-semibold mb-2 mt-4'>Appointment Time</label>
                <select className='w-full border border-gray-300 rounded p-3'>
                  <option>Select Time</option>
                  <option>09:00 AM</option>
                  <option>09:30 AM</option>
                  <option>10:00 AM</option>
                  <option>10:30 AM</option>
                </select>
              </div>
              <div className='mb-6'>
                <button className='w-full text-center p-2 bg-green-900 text-white rounded hover:bg-green-800 cursor-pointer'>Book Now</button>
              </div>
            </div>
          </div>
        </main>
    </div>
  )
}

export default BookAppointment