import React from 'react'

const Register = () => {
  return (
    <div
      className={
        "flex justify-center items-center mx-auto px-4 py-8 bg-teal-900 dark:bg-slate-900"
      }
    >
      <div className="w-5/12 p-6 shadow-lg bg-cyan-50 dark:bg-neutral-900 rounded-md">
        <Toaster position="top-left" reverseOrder="false"></Toaster>
        <h2 className="text-3xl font-medium mb-4 text-black dark:text-white text-center">
          Sign Up
        </h2>
        <form >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <button className="sbmt" type="submit">
            Submit
          </button>
        </form>
        <br />
        <div className="flex justify-between mt-4 dark:text-white">
          <p>Already have an account?</p>
          <h6>
            {/* <Link to="/login">Login</Link> */}
          </h6>
        </div>
      </div>
    </div>
  )
}

export default Register