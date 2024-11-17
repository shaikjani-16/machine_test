"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "@/service/context";
export default function Login() {
  const router = useRouter();
  const { setUsername } = useUser();
  const [user, setUser] = useState({
    userName: "",
    Pwd: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/login", user);
      const { data } = response;
      console.log(data);
      if (response.data.success === true) {
        localStorage.setItem("userName", data.userName);
        setUsername(data.userName);
        toast.success("Login success");
        router.push("/");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user.userName.length > 0 && user.Pwd.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="form border shadow-md border-gray-400 rounded-xl py-6 px-9">
        <div className="top">
          <div className="flex gap-[40px] mb-5 items-center justify-center">
            <h1 className="text-2xl font-semibold text-center">Login</h1>
          </div>
        </div>

        <div className="bottom">
          {/* Username Input */}
          <div className="">
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="border border-gray-400 hover:border-gray-700 w-96 px-1.5 py-1.5 rounded-md outline-none mb-5 placeholder-gray-400"
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="border border-gray-400 hover:border-gray-700 w-96 px-1.5 py-1.5 rounded-md outline-none mb-8 placeholder-gray-400"
              onChange={(e) => setUser({ ...user, Pwd: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              onClick={onLogin}
              disabled={buttonDisabled}
              className="bg-gray-100 hover:bg-gray-200 w-full py-1.5 border border-gray-400 rounded-md font-medium mb-5"
            >
              {buttonDisabled ? "Fill All Details" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
