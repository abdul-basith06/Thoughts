import React from 'react'
import Navbar from '../components/Navbar'
import CreateThought from '../components/CreateThought'
import toast, { Toaster } from "react-hot-toast";
import ListThoughts from '../components/ListThoughts';

const HomePage = () => {
  return (
    <div>
        <Toaster position="top-left" reverseOrder="false"></Toaster>
      <div className='bg-slate-900'>
        <Navbar />
      </div>
     <div className="p-6 max-w-3xl mx-auto space-y-6">
      <CreateThought />
      <ListThoughts />
     </div>
    </div>
  )
}

export default HomePage