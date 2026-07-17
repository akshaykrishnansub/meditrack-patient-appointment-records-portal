"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const BookAppointment = () => {
  const {logout}=useAuth();
  const router=useRouter();

  const [formData,setFormData]=useState({doctorId:"",date:"",time:""})
  const [doctors,setDoctors]=useState([]);

  useEffect(() => {
    document.title = "Patient Book Appointment | MediTrack";
  },[]);

  useEffect(()=>{
    const fetchDoctors=async()=>{
      const res=await fetch("http://localhost:5000/api/auth/doctor",{
        credentials:"include"
      })

      const data=await res.json();
      setDoctors(data);
    }
    fetchDoctors();
  },[]);

  const handleChange=(e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    const name=e.target.name;
    const value=e.target.value;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleLogout=async()=>{
    await logout();
    router.push("/login");
  }

  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try{
      const datetime=`${formData.date}T${formData.time}`;
      console.log(formData);
      console.log(datetime);
      const res=await fetch('http://localhost:5000/api/appointments',{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        credentials:"include",
        body:JSON.stringify({doctorId:formData.doctorId,datetime})
      })

      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      alert("Appointment Booked Successfully");
      router.push("/dashboard/patient/appointments");

    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex'>
        <aside className='hidden lg:block bg-white w-64 shadow p-6 '>
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
              <form onSubmit={handleSubmit}>
                <label className='block font-semibold mb-2'>Select Doctor</label>
              <select name="doctorId" value={formData.doctorId} onChange={handleChange} className='w-full border border-gray-300 rounded p-3'>
                <option>Select Doctor</option>
                {
                  doctors.map((doctor:any)=>(
                    <option key={doctor.id}
                    value={doctor.id}
                    >
                      {doctor.name}
                    </option>
                  ))
                }
              </select>
              {/*Date */}
              <div className='mb-6'>
                <label className='block font-semibold mb-2 mt-4'>Appointment Date</label>
                <input type="date" name="date" 
                value={formData.date}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded p-3'/>
              </div>
              <div className='mb-6'>
                <label className='block font-semibold mb-2 mt-4'>Appointment Time</label>
                <select name="time" 
                value={formData.time}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded p-3'>
                  <option>Select Time</option>
                  <option>09:00</option>
                  <option>09:30</option>
                  <option>10:00</option>
                  <option>10:30</option>
                  <option>11:00</option>
                  <option>11:30</option>
                  <option>12:00</option>
                  <option>12:30</option>
                  <option>13:00</option>
                  <option>13:30</option>
                  <option>14:00</option>
                  <option>14:30</option>
                </select>
              </div>
              <div className='mb-6'>
                <button className='w-full text-center p-2 bg-green-900 text-white rounded hover:bg-green-800 cursor-pointer'>Book Now</button>
              </div>
              </form>
            </div>
          </div>
        </main>
    </div>
  )
}

export default BookAppointment