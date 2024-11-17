"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/service/context";
import { toast } from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const { username, setUsername } = useUser();
  const router = useRouter();

  // Fetch username from localStorage when the app initializes
  useEffect(() => {
    const user = localStorage.getItem("userName");
    if (user) {
      setUsername(user);
    }
  }, [setUsername]);

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/logout");
      localStorage.removeItem("userName");
      setUsername(null); // Update the username in the context
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <nav className="bg-gray-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Home button */}
          <div className="flex-shrink-0">
            <Link href="/">
              <button className="text-gray-800 text-lg font-medium hover:underline">
                Home
              </button>
            </Link>
          </div>

          {/* Right side: Username and Logout */}
          <div className="flex items-center space-x-4">
            {username ? (
              <span className="text-gray-800 font-medium">
                Welcome, {username}
              </span>
            ) : (
              <span className="text-gray-500">Not logged in</span>
            )}
            {username && (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
