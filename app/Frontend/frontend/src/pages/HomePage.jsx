import React from 'react'
import Navbar from '../components/Navbar'

const HomePage = () => {
  return (
    <div>
      <div className='bg-slate-900'>
        <Navbar />
      </div>
     <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* <CreateThought />
      <ListThoughts /> */}
     </div>
    </div>
  )
}

export default HomePage