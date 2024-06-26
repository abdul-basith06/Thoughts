import React from 'react'
import Navbar from '../components/Navbar'
import Profile from '../components/Profile'
import MyThoughts from '../components/MyThoughts'

const ProfilePage = () => {

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row flex-1">
        <div className="md:w-1/2 border-r border-gray-300">
          <Profile />
        </div>
        <div className="md:w-1/2">
          <MyThoughts />
        </div>
      </div>
    </div>
  );

  // return (
  //   <div>
  //        <div>
  //     <div className="bg-slate-900">
  //       <Navbar />
  //     </div>
  //     <div className="flex bg-gray-500 h-screen">
  //       <div className="flex-1 border-r border-gray-300">
  //         <Profile />
  //       </div>
  //       <div className="flex-1">
  //         <MyThoughts />
  //       </div>
  //     </div>
  //   </div>
  //   </div>
  // )
}

export default ProfilePage