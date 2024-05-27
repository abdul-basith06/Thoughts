import React, { useState, useEffect } from "react";
import api from "../api";
import formatThoughtDate from "../utils/formatThoughtDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import CommentSection from "./CommentSection";
import Comments from "./modals/Comments";

const ListThoughts = () => {
  const [thoughts, setThoughts] = useState([]);
  const [likedThoughts, setLikedThoughts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThoughtId, setSelectedThoughtId] = useState(null);

  // In the useEffect to fetch thoughts, include setting liked status
  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const response = await api.get("/api/thoughts/");
        const data = response.data;
        setThoughts(Array.isArray(data) ? data : []);

        // Set the initial liked status for each thought
        const initialLikedStatus = {};
        data.forEach((thought) => {
          initialLikedStatus[thought.id] = thought.is_liked;
        });
        setLikedThoughts(initialLikedStatus);

        setLoading(false);
      } catch (error) {
        setError("Failed to load thoughts");
        setLoading(false);
      }
    };

    fetchThoughts();
  }, []);

  const handleLike = async (id) => {
    try {
      console.log("id",id);
      const action = likedThoughts[id] ? "unlike" : "like";
      await api.post("/api/like_unlike/", { thought_id: id, action });

      // Update the like count for the specific thought in the frontend state
      setThoughts((prevThoughts) =>
        prevThoughts.map((thought) =>
          thought.id === id
            ? {
                ...thought,
                likes_count: likedThoughts[id]
                  ? thought.likes_count - 1
                  : thought.likes_count + 1,
              }
            : thought
        )
      );

      setLikedThoughts((prevLikedThoughts) => ({
        ...prevLikedThoughts,
        [id]: !prevLikedThoughts[id],
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openComments = (thoughtId) => {
    setSelectedThoughtId(thoughtId);
    setIsOpen(true);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  const validThoughts = Array.isArray(thoughts) ? thoughts : [];

  return (
    <div className="space-y-6">
      {validThoughts.map((thought) => (
        <div
          key={thought.id}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <img
              className="rounded-full w-10 h-10 mr-4"
              src={thought.author.profile_picture} // Default picture
              alt="Author DP"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {thought.author.username}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {formatThoughtDate(thought.created_at)}
              </p>
            </div>
          </div>
          <h2 className="text-lg font-bold">{thought.title}</h2>
          <p className="text-gray-700 dark:text-gray-300">{thought.content}</p>
          <div className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`mr-2 cursor-pointer hover:text-black ${
                likedThoughts[thought.id] ? "text-yellow-500" : ""
              }`}
              onClick={() => handleLike(thought.id)}
            />
            {thought.likes_count} likes

            {/* Comment section */}
            <FontAwesomeIcon
              icon={faComment}
              className="ml-4 mr-2 cursor-pointer hover:text-black"
              onClick={() => openComments(thought.id)}
            />
          </div>

         
        </div>
      ))}
      {isOpen && (
        <Comments
          onClose={() => setIsOpen(false)}
          thoughtId={selectedThoughtId}
          handleLike={handleLike}
          likedThoughts={likedThoughts}
        />
      )}
    </div>
  );
};

export default ListThoughts;
