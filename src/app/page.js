"use client";
import Link from "next/link";
import React from "react";
import EmployeeList from "./employee/page";

const Home = () => {
  return (
    <div className=" flex justify-center items-center h-screen">
      <div className="">
        <EmployeeList />
      </div>
    </div>
  );
};

export default Home;
