import React, { useState, useEffect } from "react";
import api from "../api";
import CreateThoughtModal from "./modals/CreateThoughtModal";

const CreateThought = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  }, []);

  const profilePictureUrl = profile.profile_picture
    ? profile.profile_picture
    : "https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg";

  return (
    <div>
      <div
        className="w-full rounded-lg border border-gray-300 shadow p-4 flex items-center cursor-pointer mt-8"
        onClick={() => setIsOpen(true)}
      >
        <img
          className="rounded-full w-8 h-8 mr-2"
          src={profilePictureUrl}
          alt="User DP"
        />
        <p className="text-gray-500">Spill your thought</p>
      </div>
      {isOpen && <CreateThoughtModal onClose={() => setIsOpen(false)} profile={profile}/>}
    </div>
  );
};

export default CreateThought;
