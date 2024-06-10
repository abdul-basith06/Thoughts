import React from "react";
import { Toaster } from "react-hot-toast";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";

const ChatPage = () => {
  return (
    <div>
      <Toaster position="top-left" reverseOrder="false"></Toaster>
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Chat />
      </div>
    </div>
  );
};

export default ChatPage;
