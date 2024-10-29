"use client";
import DashboardHero from "@/app/components/Admin/DashboardHero";

import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";

import UserAnalytics from "@/app/components/Admin/Analytics/UserAnalytics";
type Props = {};
const Page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title='ELearing - Admin'
          description='LearnNow is a platform for students to learn and get help from teachers'
          keywords='programming, MERN, Redux, Machine Learning'
        />
        <div className='flex h-screen'>
          <div className='1500px:w-[16%] mr-5 w-1/5'>
            <AdminSidebar />
          </div>
          <div className='ml-5 w-[85%]'>
            <DashboardHero />
            <UserAnalytics />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};
export default Page;
