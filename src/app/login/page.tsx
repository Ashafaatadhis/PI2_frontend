"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc"; // Import ikon Google

const Login = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-800">
            Welcome Back to Daily
            <span className="text-yellow-500">Balance</span>
          </h2>

          <p className="mb-8 text-gray-600">
            Please sign in to continue and track your well-being.
          </p>
        </div>

        <div className="mb-6">
          <Button
            onClick={() => signIn("google")}
            className="mx-auto flex items-center justify-center rounded-lg bg-blue-500 !px-5 !py-5 text-lg font-semibold text-white transition duration-300 hover:bg-blue-600"
          >
            <FcGoogle className="mr-4 text-3xl" /> {/* Logo Google */}
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
