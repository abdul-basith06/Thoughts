import React from 'react'
import toast, { Toaster } from "react-hot-toast";
import Navbar from '../components/Navbar';
import FriendRequests from '../components/FriendRequests';


const FriendRequestPage = () => {
  return (
    <div>
    <Toaster position="top-left" reverseOrder="false"></Toaster>
  <div className='bg-slate-900'>
    <Navbar />
  </div>
 <div className="p-6 max-w-3xl mx-auto space-y-6">
  <FriendRequests />
 </div>
</div>
  )
}

export default FriendRequestPage