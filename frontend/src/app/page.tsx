"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const navigate=useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(()=>{
    document.title="MediTrack - Patient Appointment and Records Portal"
  },[])
  return (
    <>
    <nav className="fixed bg-white border-b border-gray-200 w-full flex items-center p-4 left-0 top-0 h-16">
      <Link href="/" className="text-2xl font-bold">Medi<span className="text-green-600">Track</span></Link>
      <div className=" hidden md:flex gap-2 ml-auto">
        <button className="bg-blue-700 px-4 py-2 text-white hover:bg-blue-600 cursor-pointer rounded" onClick={()=>navigate.push("/register")}>Register</button>
        <button className="bg-green-700 px-4 py-2 text-white hover:bg-green-600 cursor-pointer rounded" onClick={()=>navigate.push("/login")}>Login</button>
      </div>
      <button className="md:hidden ml-auto text-2xl" onClick={()=>setMenuOpen(!menuOpen)}>☰</button>
    </nav>
    {menuOpen &&(
      <div className="fixed top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col gap-3 z-40 md:hidden">
        <button onClick={() => {setMenuOpen(false);navigate.push("/register");}}className="bg-blue-700 text-white py-2 rounded hover:bg-blue-600">Register</button>
        <button onClick={() => {setMenuOpen(false);navigate.push("/login");}}className="bg-green-700 text-white py-2 rounded hover:bg-green-600">Login</button>
      </div>
    )}
    <section className="pt-24 p-4 border-b border-gray-300">
      <h2 className="text-2xl text-center font-semibold">Your Health, Simplified</h2>
      <p className="text-sm text-center mt-2">Book your appointments, manage medical records, and communicate securely with doctors.</p>
      <div className="flex gap-2 mt-8 justify-center">
        <button onClick={()=>navigate.push("/register")} className="bg-blue-700 px-4 py-2 text-white hover:bg:blue-600 cursor-pointer rounded">Get Started</button>
      </div>
    </section>
    <section className="pt-12 p-4 border-b border-gray-300 bg-gray-300">
      <h2 className="text-2xl text-center font-semibold mb-2">Why Choose MediTrack?</h2>
      <div className="bg-white p-6 rounded-lg mb-8">
        <p className="text-lg text-center mt-2">🗓️<span className="font-bold">Appointment Booking</span> - This application simplifies appointment booking and management both from patient and doctor end efficiently.</p>
        <p className="text-lg text-center mt-2">📄<span className="font-bold">Medical Records</span> - Patients can upload their relevant medical records that can be viewed by their doctors.</p>
        <p className="text-lg text-center mt-2">💬<span className="font-bold">Secure Messaging</span> - Patients can effectively communicate </p>
        <p className="text-lg text-center mt-2">👨‍⚕️<span className="font-bold">Role Based Access</span> - This is a fully authenticated system which can entirely be accessed based on user role.</p>
      </div>
    </section>
    <section className="pt-12 p-4 border-b border-gray-300 bg-green-300">
      <h2 className="text-2xl text-center font-semibold mb-4">How it works?</h2>
      <div className="bg-white p-6 rounded-lg mb-8">
        <p className="text-lg text-center mt-2">1️⃣<span className="font-bold">Register</span> - Patients must register and create their account.</p>
        <p className="text-lg text-center mt-2">2️⃣<span className="font-bold">Book Appointment</span> - Here, patients can book an appointment with their doctors.</p>
        <p className="text-lg text-center mt-2">3️⃣<span className="font-bold">Consult Doctor</span> - After booking appointment, patients can consult their doctor.</p>
        <p className="text-lg text-center mt-2">4️⃣<span className="font-bold">View Medical Records</span> - Patients can upload their medical documents which can be viewed by the doctors.</p>
      </div>
    </section>
    <footer className='p-4 mt-3'>
        <p className='text-xl text-center'>© {new Date().getFullYear()} MediTrack. Built by Akshay Krishnan</p>
    </footer>
    </>
  )
}