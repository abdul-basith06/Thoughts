import React, { useState, useEffect } from "react";
import api from "../api"; // Adjust the import based on your project structure

const ListThoughts = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const response = await api.get("/api/thoughts/");
        const data = response.data;
        setThoughts(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        setError("Failed to load thoughts");
        setLoading(false);
      }
    };

    fetchThoughts();
  }, []);

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
              <h2 className="text-lg font-semibold">{thought.title}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {thought.author.username}
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{thought.content}</p>
          <div className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            {thought.likes_count} likes
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListThoughts;
