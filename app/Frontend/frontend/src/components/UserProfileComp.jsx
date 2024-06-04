import React, { useEffect, useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import toast, { Toaster } from "react-hot-toast";
import FormatActiveDate from "../utils/formatActiveDate";

const UserProfileComp = ({ userId }) => {
  const [user, setUser] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    let loggedInUserId;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        loggedInUserId = decodedToken.user_id;
        setIsOwnProfile(loggedInUserId === parseInt(userId, 10));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    const fetchPendingRequests = async () => {
      try {
        const response = await api.get(
          `/api/connections/pending/${userId}/${loggedInUserId}/`
        );
        const pendingRequests = response.data;
        console.log("pendingRequests", pendingRequests);
        setHasPending(pendingRequests.length > 0);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/user/details/${userId}/`);
        setUser(response.data);
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
      }
    };

    if (loggedInUserId !== undefined) {
      fetchPendingRequests();
    }
    fetchUser();
  }, [userId]);

  const handleConnect = async () => {
    try {
      const response = await api.post("/api/connections/send/", {
        to_user: userId,
      });
      alert(response.data.detail);
      toast.success(response.data.detail);
    } catch (error) {
      console.error(
        "There was an error sending the connection request!",
        error
      );
      alert("Failed to send connection request.");
    }
  };

  const profilePictureUrl = user.profile_picture
    ? user.profile_picture
    : "https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg";


  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex flex-col items-center p-8">
        <Toaster position="top-left" reverseOrder="false"></Toaster>
        <div className="relative w-full flex justify-center">
          {user.profile_picture ? (
            <img
              className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-md"
              src={profilePictureUrl}
              alt=""
            />
          ) : (
            <div className="h-32 w-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full border-4 border-white shadow-md">
              No Image
            </div>
          )}
        </div>
        <div className="text-center mt-6 w-full">
          <h2 className="text-2xl leading-tight font-bold text-black">
            {user.username}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{user.bio}</p>
          <div className="mt-4 text-gray-500">
            <p className="text-md">Email: {user.email}</p>
            <p className="text-md">Mobile: {user.mobile}</p>
            <p className="text-md">
              Joined:{" "}
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

            <p className="text-md">
              <FormatActiveDate lastLogin={user.last_login} />
            </p>
          </div>
          <div className="mt-8 w-full text-center">
            <h3 className="text-xl font-semibold text-black">5</h3>
            <p className="text-md text-gray-600">Connections</p>
          </div>

          {!isOwnProfile && (
            <div className="mt-8 space-x-4">
              <button
                onClick={handleConnect}
                disabled={hasPending}
                className={`px-6 py-2 text-white rounded transition ${
                  hasPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-amber-600 cursor-pointer"
                }`}
              >
                {hasPending ? "Connection Pending" : "Connect"}
              </button>
              <button className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-amber-600 transition cursor-pointer">
                Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileComp;
