import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import api from "../../api";
import { useSelector } from "react-redux";

const EditProfile = ({ onClose, profile, setProfile }) => {
  const modalRef = useRef();
  // const { user_id } = jwtDecode(getlocal());
  const [profile_picture, setProfilePicture] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const darkMode = "";

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    console.log("updating");
    const formData = new FormData();
    formData.append("username", e.target.username.value);
    formData.append("email", e.target.email.value);
    formData.append("bio", e.target.bio.value);
    formData.append("mobile", e.target.mobile.value);
    if (profile_picture) {
      formData.append("profile_picture", profile_picture);
    }

    try {
      const response = await api.patch("/api/user/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(response.data);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const profilePictureUrl = profile.profile_picture
    ? profile.profile_picture
    : "https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg";

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className={`${
        darkMode ? "dark" : ""
      } fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center`}
    >
      <div className="mt-10 flex flex-col gap-5 text-black w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-4">
        <button onClick={onClose} className="place-self-end">
          <X size={30} />
        </button>
        <div className="bg-cyan-50 dark:bg-neutral-900 rounded-xl px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 flex flex-col gap-5 items-center mx-4">
          <h1 className="dark:text-white text-xl sm:text-2xl md:text-3xl">
            Edit Profile
          </h1>
          <img
            className="rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
            src={profilePictureUrl}
            alt="profile pic"
          />
          <form onSubmit={updateProfile} className="w-full">
            <div className="flex flex-col gap-4">
              <input
                className="dark:text-white"
                type="file"
                name="profile_picture"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 m-2 p-2 rounded"
                  type="text"
                  placeholder="Username"
                  name="username"
                  defaultValue={profile.username}
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 m-2 p-2 rounded"
                  type="text"
                  placeholder="Email"
                  name="email"
                  defaultValue={profile.email}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  onChange={(e) => setBio(e.target.value)}
                  className="m-2 p-2 rounded"
                  type="text"
                  placeholder={profile.bio ? "" : "Bio"}
                  name="bio"
                  defaultValue={profile.bio || ""}
                />
                <input
                  onChange={(e) => setMobile(e.target.value)}
                  className="m-2 p-2 rounded"
                  type="tel"
                  placeholder={profile.mobile ? "" : "Mobile"}
                  name="mobile"
                  defaultValue={profile.mobile || ""}
                />
              </div>
              <button className="confirm-btn m-2 p-2 w-20" type="submit">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    // <div
    //   ref={modalRef}
    //   onClick={closeModal}
    //   className={`${
    //     darkMode ? "dark" : ""
    //   } fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center`}
    // >
    //   <div className="mt-10 flex flex-col gap-5 text-black w-1/3">
    //     <button onClick={onClose} className="place-self-end">
    //       <X size={30} />
    //     </button>
    //     <div className="bg-cyan-50 dark:bg-neutral-900 rounded-xl px-10 py-8 flex flex-col gap-5 items-center mx-4">
    //       <h1 className="dark:text-white">Edit Profile</h1>
    //       <img
    //         className="rounded-full w-20 h-20"
    //         src={profilePictureUrl}
    //         alt="profile pic"
    //       />
    //       <form onSubmit={updateProfile} className="w-full">
    //         <div className="flex flex-col gap-4">
    //           <input
    //             className="dark:text-white"
    //             type="file"
    //             name="profile_picture"
    //             onChange={(e) => setProfilePicture(e.target.files[0])}
    //           />
    //           <div className="flex gap-4">
    //             <input
    //               onChange={(e) => setUsername(e.target.value)}
    //               className="flex-1 m-2 p-2 rounded"
    //               type="text"
    //               placeholder="Username"
    //               name="username"
    //               defaultValue={profile.username}
    //             />
    //             <input
    //               onChange={(e) => setEmail(e.target.value)}
    //               className="flex-1 m-2 p-2 rounded"
    //               type="text"
    //               placeholder="Email"
    //               name="email"
    //               defaultValue={profile.email}
    //             />
    //           </div>
    //           <div className="flex gap-4">
    //             <input
    //               onChange={(e) => setBio(e.target.value)}
    //               className="m-2 p-2 rounded"
    //               type="text"
    //               placeholder={profile.bio ? "" : "Bio"}
    //               name="bio"
    //               defaultValue={profile.bio || ""}
    //             />
    //             <input
    //               onChange={(e) => setMobile(e.target.value)}
    //               className="m-2 p-2 rounded"
    //               type="tel"
    //               placeholder={profile.mobile ? "" : "mobile"}
    //               name="mobile"
    //               defaultValue={profile.mobile || ""}
    //             />
    //           </div>
    //           <button className="confirm-btn m-2 p-2 w-20" type="submit">
    //             Confirm
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
  );
};

export default EditProfile;
