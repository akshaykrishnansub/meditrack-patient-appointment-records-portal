"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const Register = () => {
    const [formData,setFormData]=useState({name:"",email:"",password:"",confirmPassword:""})
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"warning";}|null>(null);

    useEffect(() => {
        document.title = "Registration | MediTrack";
    },[]);

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const name=e.target.name;
        const value=e.target.value;
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const showToast=(message:string,type:"success"|"error"|"warning"="success")=>{
        setToast({message,type});
        setTimeout(()=>{
            setToast(null);
        },3000);
    }

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(formData.password!==formData.confirmPassword){
            showToast("Passwords do not match","warning");
            return;
        }
        console.log(formData);

        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,{
            method:"POST",
            credentials:"include",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name:formData.name,
                email:formData.email,
                password:formData.password
            })
        })
        const data=await res.json();
        if(!res.ok){
            showToast(data.error || "Registration Failed", "error");
            return;
        }
        showToast("Registration Successful", "success");
        setFormData({
          name:"",
          email:"",
          password:"",
          confirmPassword:""  
        })
    }catch(err){
        console.error(err);
        showToast("Something went wrong", "error");
    }
}

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
        <div className='w-full max-w-md'>
            <h1 className='text-4xl font-bold mb-2 text-center'>Medi<span className='text-green-600'>Track</span></h1>
            <h2 className='text-2xl font-semibold mb-2 text-center'>Create Your Account</h2>
            <p className='text-gray-600 text-center mb-6'>Join meditrack to manage your health with ease</p>
            <div className='bg-white border rounded-lg shadow-2xl p-8'>
                <form onSubmit={handleSubmit}>
                    <div className='mb-5'>
                        <label htmlFor="Full Name" className='block mb-2 font-medium'>Full Name</label>
                        <input type="text"
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                        placeholder='Enter your full name'
                        required
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="Email" className="block mb-2 font-medium">Email</label>
                        <input type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600" 
                        placeholder='Enter your email'
                        required
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="Password" className='block mb-2 font-medium'>Password</label>
                        <input type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600" 
                        placeholder='Enter your password'
                        required
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="Confirm Password" className='block mb-2 font-medium'>Confirm Password</label>
                        <input type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder='Confirm your Password'
                        required
                        />
                    </div>
                    <div className='mb-5'>
                        <button type="submit" className='text-white font-bold bg-green-700 hover:bg-green-600 cursor-pointer w-full p-2 rounded'>Register</button>
                    </div>
                </form>
                <div className='text-center'>
                    <p>Already a Member? <Link href="/login" className='underline text-green-700'>Click Here to Sign In</Link></p>
                </div>
            </div>
        </div>
        {toast && (
            <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 animate-slide-in
                ${toast.type==="success"?"bg-green-600":toast.type==="error"?"bg-red-600":"bg-yellow-600"}`}>{toast.message}</div>
        )}
    </div>
    
  )
}

export default Register