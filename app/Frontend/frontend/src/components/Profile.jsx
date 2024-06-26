import React, { useState, useEffect } from "react";
import axios from "axios";
import api from '../api'
import { jwtDecode } from 'jwt-decode'
import EditProfile from "./modals/EditProfile";
import { ACCESS_TOKEN } from "../constants";

const Profile = () => {

  const getlocal =()=> {
    let response=localStorage.getItem(ACCESS_TOKEN)
    return response
  }

  const { user_id } = jwtDecode(getlocal());
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    mobile: "",
    bio: "",
    profile_picture: "",
  });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/user/profile/");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [user_id, isOpen]);


  const profilePictureUrl = profile.profile_picture
    ? profile.profile_picture
    : "https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg";


  return (
    <div className="p-4  h-full flex flex-col items-center bg-red-400">
      <h2 className="text-2xl font-bold mb-6">MY PROFILE</h2>
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full bg-gray-300">
          {/* Add profile picture here */}
          <img className="rounded-full" src={profilePictureUrl} alt="" />
        </div>

        {/* Profile Details */}
        <div className="text-center text-white">
          <h3 className="text-xl font-semibold">{profile.username}</h3>
          <p className="text-lg">{profile.bio}</p>
          <p className="text-sm">{profile.email}</p>
          <p className="text-sm">{profile.mobile}</p>
        </div>

        {/* Edit Profile Button */}
        <button onClick={()=>setIsOpen(true)} className="mt-4 px-4 py-2 bg-white text-pink-700 rounded hover:bg-gray-200 transition">
          Edit Profile
        </button>
      </div>
      {isOpen && (
        <EditProfile onClose={()=> setIsOpen(false)} profile={profile} setProfile={setProfile}/>
      )}
    </div>
  );
};

export default Profile;
