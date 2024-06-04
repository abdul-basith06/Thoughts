import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const FriendRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
 

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await api.get("/api/connections/pending/");
        setPendingRequests(response.data);
      
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };



    // const fetchFriends = async () => {
    //   try {
    //     const response = await api.get('/api/connections/send/');
    //     // setFriends(response.data);
    //   } catch (error) {
    //     console.error('Error fetching friends:', error);
    //   }
    // };

    fetchPendingRequests();
    // fetchFriends();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.put("/api/connections/handle/", {
        request_id: requestId,
        action: "accept",
      });
      setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
      toast.success("Connection request accepted")
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Error accepting request")
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await api.put("/api/connections/handle/", {
        request_id: requestId,
        action: "reject",
      });
      setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
      toast.success("Connection request rejected")
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error rejecting request")
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <Toaster position="top-left" reverseOrder="false"></Toaster>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Friend Requests
      </h2>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">
          Pending Requests
        </h3>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600">No pending requests</p>
        ) : (
          pendingRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between mb-6 p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <Link to={`/profilepage/${request.from_user.id}`}>
                  <img
                    src={
                      request.from_user.profile_picture ||
                      "https://via.placeholder.com/50"
                    }
                    alt={request.from_user.username}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                </Link>
                <div>
                  <Link to={`/profilepage/${request.from_user.id}`}>
                    <p className="text-lg font-semibold text-gray-800">
                      {request.from_user.username}
                    </p>
                    <p className="text-gray-600">{request.from_user.email}</p>
                  </Link>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition transform hover:scale-105"
                  onClick={() => handleAcceptRequest(request.id)}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition transform hover:scale-105"
                  onClick={() => handleRejectRequest(request.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">
          Current Friends
        </h3>
        {friends.length === 0 ? (
          <p className="text-gray-600">No friends</p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center mb-6 p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <img
                src={friend.profile_picture || "https://via.placeholder.com/50"}
                alt={friend.username}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {friend.username}
                </p>
                <p className="text-gray-600">{friend.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
