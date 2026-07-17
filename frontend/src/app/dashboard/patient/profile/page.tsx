"use client"
import React, { useEffect } from 'react'

const page = () => {
    useEffect(() => {
      document.title = "Patient Profile | MediTrack";
    },[]);

  return (
    <div>page</div>
  )
}

export default page