"use client"
import React, { useEffect } from 'react'

const page = () => {
    useEffect(() => {
      document.title = "Admin Profile | MediTrack";
    },[]);
  return (
    <div>page</div>
  )
}

export default page