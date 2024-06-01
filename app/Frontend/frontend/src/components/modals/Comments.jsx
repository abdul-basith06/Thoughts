import React, { useState, useRef, useEffect } from "react";
import api from "../../api";
import formatThoughtDate from "../../utils/formatThoughtDate";
import formatCommentDate from "../../utils/formatCommentDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../../constants";

const Comments = ({ onClose, thoughtId, handleLike, likedThoughts }) => {
  const darkMode = "";
  const modalRef = useRef();
  const [thought, setThought] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");

  const getlocal = () => {
    let response = localStorage.getItem(ACCESS_TOKEN);
    return response;
  };

  const { user_id } = jwtDecode(getlocal());

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/comments/", {
        content: comment,
        thought: thoughtId,
        author: user_id,
      });
      setThought((prevThought) => ({
        ...prevThought,
        comments: [...prevThought.comments, response.data],
      }));
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    const fetchThoughtDetails = async () => {
      try {
        const response = await api.get(`/api/thoughts/${thoughtId}/`);
        setThought(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load thought details");
        setLoading(false);
      }
    };

    fetchThoughtDetails();
  }, [thoughtId, handleLike, comment]);

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          thought && (
            <>
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
              <h2 className="text-lg font-bold mb-4">{thought.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {thought.content}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className={`mr-2 cursor-pointer hover:text-black ${
                    likedThoughts[thought.id] ? "text-yellow-500" : ""
                  }`}
                  onClick={() => handleLike(thought.id)}
                />
                {thought.likes_count} likes
              </div>

              {/* input to post a comment */}
              <div className="mb-4">
                <div className="flex mb-2">
                  <img
                    className="rounded-full w-10 h-10 mr-4"
                    src={thought.author.profile_picture} // Default picture
                    alt="Author DP"
                  />
                  <input
                    type="text"
                    placeholder="Your comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-pink-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="flex justify-end gap-4 w-full">
                  {comment && (
                    <button
                      onClick={() => setComment("")}
                      className="font-bold text-gray-500 hover:text-black cursor-pointer"
                    >
                      CANCEL
                    </button>
                  )}
                  {comment && (
                    <button
                      onClick={handleCommentSubmit}
                      className="py-2 px-4 rounded-md bg-yellow-500 text-black cursor-pointer hover:bg-yellow-600"
                    >
                      POST
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-md font-semibold mb-2">Comments</h3>
              <div className="space-y-4">
                {thought.comments && thought.comments.length > 0 ? (
                  thought.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start border-b border-gray-200 dark:border-gray-700 pb-2"
                    >
                      <img
                        className="rounded-full w-8 h-8 mr-2"
                        src={comment.author.profile_picture}
                        alt="Comment Author DP"
                      />
                      <div className="bg-pink-50 p-3 rounded-lg flex-1">
                        <h4 className="text-sm font-semibold">
                          {comment.author.username}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {formatCommentDate(comment.created_at)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No comments yet.
                  </p>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Comments;
