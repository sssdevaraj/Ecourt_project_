import { Button } from "@headlessui/react";
import { useState } from "react";
import ForgotPassword from "./ForgotPasswordModal";
import ForgotUserName from "./ForgotUserName";
const LoginForm = ({ setIsLogin, handleAuth }) => {
  const [open, SetOpen] = useState(false);

  return (
    <>
      <form
        onSubmit={handleAuth}
        className="p-6 md:p-12 bg-white shadow-lg rounded-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-semibold text-center">Welcome Back</h1>
        <p className="text-sm text-gray-600 text-center">Login to continue</p>

        {/* username Input */}
        <input
          type="text"
          name="username"
          placeholder="username"
          className="p-3 border rounded-lg"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-3 border rounded-lg"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg transition"
        >
          Login
        </button>

        {/* Sign-up Link */}
        <p className="text-center text-sm text-black mt-2">
          Don't have an account?{" "}
          <button
            onClick={() => setIsLogin(false)}
            className="text-blue-600 underline"
          >
            Sign Up
          </button>
        </p>

        {/* ✅ Fixed Forgot Password Button */}
        <Button type="button" onClick={() => SetOpen(true)}> Forgot Password </Button>
        <Button type ="button" onClick={() => SetOpen(true)}> Forgot username </Button>


        <ForgotPassword open={open} close={() => SetOpen(false)} />
          <ForgotUserName open={open} close={() => SetOpen(false)} />
      </form>
    </>
  );
};

export default LoginForm;
