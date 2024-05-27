import React, { useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

const CommentSection = ({ thoughtId, comments, setComments }) => {
  const [newComment, setNewComment] = useState("");

  const getlocal = () => {
    let response = localStorage.getItem(ACCESS_TOKEN);
    return response;
  };

  const { user_id } = jwtDecode(getlocal());

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/comments/", {
        content: newComment,
        thought: thoughtId,
        author: user_id
      });
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-2">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>{comment.author_username}:</strong> {comment.content}
          </p>
        </div>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="border border-gray-300 p-2 rounded w-full mt-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-2"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
