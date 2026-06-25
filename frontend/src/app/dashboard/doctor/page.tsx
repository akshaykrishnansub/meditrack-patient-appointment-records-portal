"use client"
import Link from 'next/link'
import React from 'react'

const DoctorDashboard = () => {
  return (
    <div className='bg-gray-100 flex'>
      {/*sidebar*/}
      <aside className='hidden lg:block min-h-screen w-64 bg-white shadow-md p-6'>
        <h1 className='text-2xl font-bold mb-8'>Medi<span className='text-green-600'>Track</span></h1>
        <nav className='space-y-4'>
          <Link href="/dashboard/doctor" className='block font-bold p-2 rounded hover:bg-green-200'>Doctor Dashboard</Link>
          <Link href="/dashboard/doctor/records" className='block font-bold p-2 rounded hover:bg-green-200'>Patient Records</Link>
          <Link href="/dashboard/doctor/messages" className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
          <Link href="/dashboard/doctor/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Doctor Profile</Link>
          <button className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 p-8'>
        {/*Welcome doctor section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Welcome, Doctor Name</h1>
          <p className='mt-4'>View, Approve, Reschedule, Cancel Appointments and View Patient Records</p>
        </div>
        {/*Stats section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Today's appointments</h3>
            <p className='text-3xl font-bold mt-2'>8</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Pending Approvals</h3>
            <p className='text-3xl font-bold mt-2'>3</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Reschedules</h3>
            <p className='text-3xl font-bold mt-2'>1</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow mb-8'>
          <h3 className='text-2xl font-bold'>Pending Requests</h3>
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            <div className='bg-white p-6 shadow rounded mt-2 hover:border border-green-800'>
              <p className='text-xl font-semibold'>Patient Name:</p>
              <p className='text-xl font-semibold'>Date:</p>
              <p className='text-xl font-semibold'>Time:</p>
              <div className='mt-4 flex flex-col lg:flex-row gap-2'>
                <button className='bg-green-700 text-white font-bold p-2 rounded'>Approve</button>
                <button className='bg-yellow-600 text-white font-bold p-2 rounded'>Reschedule</button>
                <button className='bg-red-700 text-white font-bold p-2 rounded'>Cancel</button>
              </div>
            </div>
            <div className='bg-white p-6 shadow rounded mt-2 hover:border border-green-800'>
              <p className='text-xl font-semibold'>Patient Name:</p>
              <p className='text-xl font-semibold'>Date:</p>
              <p className='text-xl font-semibold'>Time:</p>
              <div className='mt-4 flex flex-col lg:flex-row gap-2'>
                <button className='bg-green-700 text-white font-bold p-2 rounded'>Approve</button>
                <button className='bg-yellow-600 text-white font-bold p-2 rounded'>Reschedule</button>
                <button className='bg-red-700 text-white font-bold p-2 rounded'>Cancel</button>
              </div>
            </div>
            <div className='bg-white p-6 shadow rounded mt-2 hover:border border-green-800'>
              <p className='text-xl font-semibold'>Patient Name:</p>
              <p className='text-xl font-semibold'>Date:</p>
              <p className='text-xl font-semibold'>Time:</p>
              <div className='mt-4 flex flex-col lg:flex-row gap-2'>
                <button className='bg-green-700 text-white font-bold p-2 rounded'>Approve</button>
                <button className='bg-yellow-600 text-white font-bold p-2 rounded'>Reschedule</button>
                <button className='bg-red-700 text-white font-bold p-2 rounded'>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white mb-8 p-6 rounded-lg shadow'>
          <h3>Quick Actions</h3>
          <div className='mt-4 flex flex-col lg:flex-row gap-2'>
            <button className='text-white font-bold px-4 py-2 rounded bg-green-700 hover:bg-green-600'>View Records</button>
            <button className='text-white font-bold px-4 py-2 rounded bg-blue-700 hover:bg-blue-600'>Manage Schedule</button>
            <button className='text-white font-bold px-4 py-2 rounded bg-purple-700 hover:bg-purple-600'>Messages</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard