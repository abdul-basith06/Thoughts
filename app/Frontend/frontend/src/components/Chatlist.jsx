import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

const Chatlist = () => {
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    try {
      const response = await api.get("/api/connections/friends/");
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Error fetching friends");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Friends</h2>
      <ul className="space-y-4">
        {friends.map(friend => (
          <li key={friend.id} className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            <img 
              src={friend.profile_picture || 'https://via.placeholder.com/40'} 
              alt="profile" 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{friend.username}</h3>
              <p className="text-gray-500">{friend.email}</p>
            </div>
            <Link to={`/chat/${friend.id}`}>
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-amber-600 transition cursor-pointer">
                Chat
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chatlist;
