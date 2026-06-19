import React from 'react'
import Link from 'next/link'

const Login = () => {
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
      <div className='w-full max-w-md'>
        <h1 className='text-center font-bold mb-2 text-4xl'>Medi<span className='text-green-600'>Track</span></h1>
        <h2 className='text-center mb-2 font-semibold text-2xl'>Welcome Back</h2>
        <p className='text-center text-gray-600 mb-6'>Login to your account to continue</p>
        <div className='bg-white border rounded-lg shadow-2xl p-8'>
          <form action="">
            <div className='mb-5'>
              <label htmlFor="Email">Email</label>
              <input type="email" 
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
              placeholder='Enter your email' />
            </div>
            <div className='mb-5'>
              <label htmlFor="Password">Password</label>
              <input type="password"
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600'
              placeholder='Enter your Password' />
            </div>
            <div className='mb-5'>
              <button type='submit' className='w-full text-white bg-green-700 p-2 rounded hover:bg-green-600 cursor-pointer font-bold'>Login</button>
            </div>
          </form>
          <div>
            <p className='text-center'>Don't have an account yet? <Link href="/register" className='underline text-green-600'>Click here to sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login