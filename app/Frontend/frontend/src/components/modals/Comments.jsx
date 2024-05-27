import React, { useState, useRef, useEffect } from "react";
import api from "../../api";
import formatThoughtDate from "../../utils/formatThoughtDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";

const Comments = ({ onClose, thoughtId, handleLike, likedThoughts  }) => {
  const darkMode = "";
  const modalRef = useRef();
  const [thought, setThought] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
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
  }, [thoughtId, handleLike]);


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
              <p className="text-gray-700 dark:text-gray-300 mb-4">{thought.content}</p>
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
              <h3 className="text-md font-semibold mb-2">Comments</h3>
              {/* Comments will be displayed here */}
              <div className="space-y-4">
                {thought.comments && thought.comments.length > 0 ? (
                  thought.comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                      <div className="flex items-center mb-2">
                        <img
                          className="rounded-full w-8 h-8 mr-2"
                          src={comment.author.profile_picture}
                          alt="Comment Author DP"
                        />
                        <div>
                          <h4 className="text-sm font-semibold">
                            {comment.author.username}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {formatThoughtDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
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
