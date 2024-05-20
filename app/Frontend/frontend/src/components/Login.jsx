import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import login, { getlocal } from "../helpers/auth";
// import { useDispatch, useSelector } from "react-redux";
// import { jwtDecode } from "jwt-decode";
// import { updateToken, updateUser } from "../features/UserSlice";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
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
        <form >
          <div className="mb-4">
            <input type="text" placeholder="username" name="username" />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="password" name="password" />
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
  )
}

export default Login