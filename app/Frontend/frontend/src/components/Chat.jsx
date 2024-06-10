import React, { useEffect, useRef } from 'react';

const Chat = () => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the messages container on component mount
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-gray-800 p-4 text-white text-xl">
        Chat with Username
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Dummy Messages */}
        {[...Array(10)].map((_, index) => (
          <div key={index}>
            {/* Received Message */}
            <div className="flex items-start mb-4">
              <img
                src="https://via.placeholder.com/40"
                alt="profile"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="bg-white p-3 rounded-lg shadow-md">
                <p className="text-gray-800">Hello! How are you?</p>
                <span className="text-xs text-gray-500 mt-1">10:30 AM</span>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex items-end justify-end mb-4">
              <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md">
                <p className="text-gray-100">I'm good, thanks! How about you?</p>
                <span className="text-xs text-gray-200 mt-1">10:32 AM</span>
              </div>
            </div>
          </div>
        ))}
        {/* Reference to keep track of the end of messages */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 flex items-center border-t border-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
