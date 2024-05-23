import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api";

const CreateThoughtModal = ({ onClose, profile }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const darkMode = "";
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();

    const thoughtData = { title: title, content: content };
    try {
      const res = await api.post("/api/thoughts/", thoughtData);
      toast.success("Thought posted successfully");
      onClose();
    } catch (error) {
      console.error("Error posting thought:", error);
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
      <div className="mt-10 flex flex-col gap-5 text-black w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl px-8 py-4 sm:px-10 sm:py-6 md:px-12 md:py-8 flex flex-col gap-4 mx-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              className="rounded-full w-12 h-12"
              src={profilePictureUrl}
              alt="User DP"
            />
            <span className="text-lg font-semibold">{profile.username}</span>
          </div>
          <input
            className="w-full p-2 border-none focus:ring-0 dark:bg-neutral-800 rounded-md"
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full p-2 border-none focus:ring-0 dark:bg-neutral-800 rounded-md"
            placeholder="What's on your mind?"
            type="text"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></input>
          <div className="flex justify-end gap-4 mt-4 w-full">
            <button
              onClick={onClose}
              className="font-bold text-gray-500 hover:text-black cursor-pointer"
            >
              CANCEL
            </button>

            <button
              onClick={handlePost}
              className={`py-2 px-4 rounded-md ${
                content.trim() && title.trim()
                  ? "bg-yellow-500 text-black cursor-pointer hover:bg-yellow-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!content.trim() && !title.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateThoughtModal;
