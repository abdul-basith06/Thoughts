import React from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import UserProfileComp from "../components/UserProfileComp";

const UserProfile = () => {
  const { userId } = useParams();
  return (
    <div>
      <div>
        <Toaster position="top-left" reverseOrder="false"></Toaster>
        <div className="bg-slate-900">
          <Navbar />
        </div>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
        <UserProfileComp userId={userId}/>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
