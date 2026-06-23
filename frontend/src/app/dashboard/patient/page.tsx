import React from 'react'
import Link from 'next/link'

const PatientDashboard = () => {
  return (
    <div className='bg-gray-100 flex'>
      {/* sidebar */}
      <aside className='min-h-screen w-64 bg-white shadow-md p-6'>
        <h1 className='text-2xl font-bold mb-8 '>Medi<span className='text-green-600'>Track</span></h1>
        <nav className='space-y-4'>
          <Link href="/dashboard/patient" className='block font-bold p-2 rounded hover:bg-green-200'>Dashboard</Link>
          <Link href="/dashboard/patient/appointments" className='block font-bold p-2 rounded hover:bg-green-200'>Appointments</Link>
          <Link href="/dashboard/patient/records" className='block font-bold p-2 rounded hover:bg-green-200'>Medical Records</Link>
          <Link href="/dashboard/patient/profile" className='block font-bold p-2 rounded hover:bg-green-200'>Profile</Link>
          <Link href="/dashboard/patient/messages" className='block font-bold p-2 rounded hover:bg-green-200'>Messages</Link>
          <button className='mt-auto bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600'>Logout</button>
        </nav>
      </aside>
      <main className='flex-1 p-8'>
        {/*Welcome section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Welcome, Patient Name</h1>
          <p className='mt-4'>Manage appointments and medical records</p>
        </div>
        {/*Stats section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Total Appointments</h3>
            <p className='text-3xl font-bold mt-2'>12</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Upcoming Appointments</h3>
            <p className='text-3xl font-bold mt-2'>8</p>
          </div>
          <div className='bg-white p-6 shadow rounded'>
            <h3 className='text-gray-600'>Medical Records</h3>
            <p className='text-3xl font-bold mt-2'>3</p>
          </div>
        </div>
        {/*Upcoming appointment*/}
        <div className='bg-white p-6 rounded-lg shadow mb-8'>
          <h3 className='text-xl font-semibold mb-4'>Upcoming Appointment</h3>
          <p><b>Doctor:</b></p>
          <p><b>Date:</b></p>
          <p><b>Time:</b></p>
          <p><b>Status:</b></p>
        </div>
        {/*Quick Actions */}
        <div className='bg-white p-6 shadow rounded'>
          <h3 className='text-xl'>Quick Actions</h3>
          <div className='flex flex-wrap gap-4'>
           <Link href='/dashboard/patient/appointments/book' className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'>Book Appointment</Link> 
           <Link href='/dashboard/patient/appointments/book' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>My Appointments</Link> 
           <Link href='/dashboard/patient/appointments/book' className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700'>Medical Records</Link> 
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientDashboard