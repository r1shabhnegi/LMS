"use client";

import Header from "../components/Header";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/DashboardHero";
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
        <div className='flex h-[200vh]'>
          <div className='1500px:w-[16%] mr-5 w-1/5'>
            <AdminSidebar />
          </div>
          <div className='ml-5 w-[85%]'>
            <DashboardHero isDashboard={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};
export default Page;
