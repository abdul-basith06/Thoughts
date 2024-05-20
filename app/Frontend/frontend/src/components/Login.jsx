import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const route="/api/token/"

  useEffect(() => {
    let response=localStorage.getItem(ACCESS_TOKEN)
    if (response) {
      navigate("/");
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div
      className={
        " flex justify-center items-center mx-auto px-4 py-8 min-h-screen bg-teal-900 dark:bg-slate-900"
      }
    >
      <div className="w-5/12 p-6 shadow-lg bg-cyan-50 dark:bg-neutral-900 rounded-md mt-12">
        <Toaster position="top-left" reverseOrder="false"></Toaster>
        <h2 className="text-3xl font-medium mb-4 text-black dark:text-white text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="sbmt" type="submit">
            Submit
          </button>
        </form>
        <div className="flex justify-between mt-4 dark:text-white">
          <p>Dont have an account..??</p>
          <h6 className="text-#1d4ed8">
            <Link to="/register">Register here</Link>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Login;
