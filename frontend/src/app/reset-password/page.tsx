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
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

    useEffect(() => {
      document.title = "Reset Password | MediTrack";
    },[]);

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
    setToast({message,type});
    setTimeout(()=>{
      setToast(null);
    },3000);
  }

    const handleResetPassword=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      if(!token){
        showToast("Invalid or missing reset token","error");
        return;
      }

      if(!password.trim()||!confirmPassword.trim()){
        showToast("Please fill in all the fields","warning");
        return;
      }



      if(password!==confirmPassword){
        showToast("Passwords do not match","warning");
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
          showToast(data.error || "Password reset failed","error");
          return;
        }
        showToast("Password Reset Successfully","success");
        router.push("/login");
      }catch(err){
        console.error(err);
        showToast("Something went wrong","error");
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
                  required
                  />
                  <label htmlFor="confirmPassword" className='block mb-2 font-medium mt-2'>Confirm Password</label>
                  <input type="password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  placeholder='Confirm New Password'
                  className='w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 px-4 py-2 rounded'
                  required
                  />
                  <button type="submit"
                  disabled={loading}
                  className='mt-4 w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer'>
                  {loading?"Resetting...":"Reset Password"}</button>
                </div>
              </form>
            </div>
        </div>
        {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
          ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
          )}
    </div>
  )
}

export default ResetPassword