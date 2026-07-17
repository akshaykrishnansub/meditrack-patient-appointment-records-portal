"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ResetPassword = () => {
    const router=useRouter();
    const searchParams=useSearchParams();
    const token=searchParams.get("token");
    const [password,setPassword]=useState<string>("");
    const [confirmPassword,setConfirmPassword]=useState<string>("");
    const [loading,setLoading]=useState<boolean>(false);

    useEffect(() => {
      document.title = "Reset Password | MediTrack";
    },[]);

    const handleResetPassword=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      if(!token){
        alert("Invalid or missing reset token");
        return;
      }

      if(!password.trim()||!confirmPassword.trim()){
        alert("Please fill in all the fields");
        return;
      }

      if(password!==confirmPassword){
        alert("Passwords do not match ");
        return;
      }

      try{
        setLoading(true);
        const res=await fetch("http://localhost:5000/api/auth/reset-password",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({token,password})
        })
        const data=await res.json();
        if(!res.ok){
          alert(data.error || "Password reset failed");
          return;
        }
        alert("Password Reset Successfully");
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
            <p className='text-gray-600 text-center mb-6'>Reset your password here.</p>
            <div className='bg-white border rounded-lg shadow-2xl p-8'>
              <form onSubmit={handleResetPassword}>
                <div className='mb-5'>
                  <label htmlFor="password" className='block mb-2 font-medium'>Password</label>
                  <input type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder='New Password'
                  className='w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 px-4 py-2 rounded'
                  />
                  <label htmlFor="confirmPassword" className='block mb-2 font-medium mt-2'>Confirm Password</label>
                  <input type="password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  placeholder='Confirm New Password'
                  className='w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 px-4 py-2 rounded'
                  />
                  <button type="submit"
                  disabled={loading}
                  className='mt-4 w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer'>
                  {loading?"Resetting...":"Reset Password"}</button>
                </div>
              </form>
            </div>
        </div>
    </div>
  )
}

export default ResetPassword