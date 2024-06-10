import React from 'react'
import Chatlist from '../components/Chatlist'
import Navbar from '../components/Navbar';
import toast, { Toaster } from "react-hot-toast";

const ChatlistPage = () => {
  return (
    <div>
      <Toaster position="top-left" reverseOrder="false"></Toaster>
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Chatlist />
      </div>
    </div>
  )
}

export default ChatlistPage