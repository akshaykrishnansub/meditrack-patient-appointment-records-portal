"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ForgotPassword = () => {
  const router=useRouter();
  const [email,setEmail]=useState<string>("");
  const [loading,setLoading]=useState<boolean>(false);

  useEffect(() => {
    document.title = "Forgot Password | MediTrack";
  },[]);

  const handleForgotPassword=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!email.trim()){
      alert("Email required");
      return;
    }

    try{
      setLoading(true);
      const res=await fetch("http://localhost:5000/api/auth/forgot-password",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email})
      })
      const data=await res.json();
      if(!res.ok){
        alert(data.error);
        return;
      }
      alert("If an account exists with this email, a password reset link has been sent");
      router.push("/login");
    }catch(err){
      console.error(err);
      alert("Something went wrong");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
      <div className='max-w-md w-full'>
        <h1 className='text-4xl font-bold mb-2 text-center'>Medi<span className='text-green-600'>Track</span></h1>
        <p className='text-gray-600 text-center mb-2'>Forgot your password? No worries. You can always reset it if you forgot</p>
        <div className='bg-white border rounded-lg shadow-2xl p-8'>
          <form onSubmit={handleForgotPassword}>
            <div className='mb-5'>
              <label htmlFor="email" className='block mb-2 font-medium'>Email</label>
              <input type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder='Enter your Registered Email Address'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
              />
              <button type="submit" className='w-full mt-4 cursor-pointer bg-green-700 text-white px-4 py-2 hover:bg-green-600'>{loading?"Sending":"Send Reset Link"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword