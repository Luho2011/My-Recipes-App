"use client";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import React from 'react'

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
       <button 
        onClick={() => signIn("google", {callbackUrl: "/"})}
        className="bg-green-800 hover:bg-green-600 text-white text-2xl rounded-2xl transition px-6 py-4 shadow border-4-black cursor-pointer flex gap-3 items-center"
        >
           <FcGoogle className="w-7 h-7" />
           Sign in with Google  
        </button>
    </div>
  )
}

