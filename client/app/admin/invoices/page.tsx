"use client";

import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AllInvoices from "@/app/components/Admin/Order/AllInvoices";

type Props = {};
const Page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title='ELearing - Admin'
          description='ELearning is a platform for students to learn and get help from teachers'
          keywords='programming, MERN, Redux, Machine Learning'
        />
        <div className='flex h-screen'>
          <div className='1500px:w-[16%] mr-5 w-1/5'>
            <AdminSidebar />
          </div>
          <div className='ml-5 w-[85%]'>
            <DashboardHero />
            <AllInvoices />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};
export default Page;
