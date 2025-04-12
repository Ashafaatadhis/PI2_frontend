"use client";

import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; // Mengimpor ikon

export const Navbar = ({ session }: { session: Session | null }) => {
  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <nav className="fixed top-0 left-0 z-10 flex w-full items-center justify-between bg-white/70 px-6 py-4 shadow-md backdrop-blur-sm">
      <h1 className="text-2xl font-bold text-blue-700">
        Daily<span className="text-yellow-500">Balance</span>
      </h1>
      {session ? (
        <div
          onClick={handleSignOut}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-blue-500 transition-colors duration-300 ease-in-out hover:text-blue-700"
        >
          <FaSignOutAlt className="text-lg" />
          Sign out
        </div>
      ) : (
        <Link href="/login">
          <div className="flex items-center gap-2 rounded-lg px-4 py-2 text-blue-500 transition-colors duration-300 ease-in-out hover:text-blue-700">
            <FaSignInAlt className="text-lg" />
            Sign in
          </div>
        </Link>
      )}
    </nav>
  );
};
