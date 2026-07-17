"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const Register = () => {
    const [formData,setFormData]=useState({name:"",email:"",password:"",confirmPassword:""})

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

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(formData.password!==formData.confirmPassword){
            alert("Passwords do not match");
            return;
        }
        console.log(formData);

        try{
            const res=await fetch("http://localhost:5000/api/auth/register",{
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
            alert(data.error || "Registration Failed");
            return;
        }
        alert("Registration Successful");
        setFormData({
          name:"",
          email:"",
          password:"",
          confirmPassword:""  
        })
    }catch(err){
        console.error(err);
        alert("Something went wrong");
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
    </div>
    
  )
}

export default Register