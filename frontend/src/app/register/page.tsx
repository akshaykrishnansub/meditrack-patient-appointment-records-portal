import React from 'react'
import Link from 'next/link'

const Register = () => {
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
        <div className='w-full max-w-md'>
            <h1 className='text-4xl font-bold mb-2 text-center'>Medi<span className='text-green-600'>Track</span></h1>
            <h2 className='text-2xl font-semibold mb-2 text-center'>Create Your Account</h2>
            <p className='text-gray-600 text-center mb-6'>Join meditrack to manage your health with ease</p>
            <div className='bg-white border rounded-lg shadow-2xl p-8'>
                <form>
                    <div className='mb-5'>
                        <label htmlFor="Full Name" className='block mb-2 font-medium'>Full Name</label>
                        <input type="text" 
                        className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
                        placeholder='Enter your full name' 
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="Email" className="block mb-2 font-medium">Email</label>
                        <input type="email" 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600" 
                        placeholder='Enter your email'
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="Password" className='block mb-2 font-medium'>Password</label>
                        <input type="password" 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600" 
                        placeholder='Enter your password'
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="Confirm Password" className='block mb-2 font-medium'>Confirm Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
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