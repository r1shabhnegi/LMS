"use client";
import React from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import CreateCourse from "@/app/components/Admin/Course/CreateCourse";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";

const Page = () => {
  return (
    <div>
      <Heading
        title='ELearing - Admin'
        description='LearnNow is a platform for students to learn and get help from teachers'
        keywords='programming, MERN, Redux, Machine Learning'
      />
      <div className='flex'>
        <div className='1500px:w-[16%] w-1/5'>
          <AdminSidebar />
        </div>
        <div className='ml-5 w-[85%]'>
          <DashboardHeader />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};
export default Page;
