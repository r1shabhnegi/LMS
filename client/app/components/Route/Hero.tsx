import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
type Props = {};

const Hero: FC<Props> = (props) => {
  const { data, refetch } = useGetHeroDataQuery("Banner");
  return (
    <div className='w-full 1000px:flex items-center'>
      {/* <div className='top-[100px] 1000px:top-[unset] 1500px:h-[700px]  1100px:h-[600px]  h-[50vh] hero_animation 400px:flex justify-around'></div> */}
      <div className='1000px:w-[40%] flex 1000px:min-h-screen items-center  justify-end pt-[70px] 1000px:pt-[0] z-10'>
        <Image
          src={data?.layout?.banner?.image?.url}
          width={400}
          height={400}
          alt=''
          className='object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]'
        />
      </div>
      <div className=' 1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]'>
        <h2 className='dark:text-white text-[#000000c7] text-[30px] w-[90%]  px- w-ful 1000px:text-[50px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[55%] 1100px:w-[78%]'>
          {data?.layout?.banner?.title}
        </h2>
        <br />
        <p className='dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] w-[90%] 1500px:!w-[55%] 1100px:!w-[78%]'>
          {data?.layout?.banner?.subTitle}
        </p>
        <br />
        <br />
        <div className='1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative'>
          <input
            type='search'
            placeholder='Search Courses...'
            className='bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin'
          />
          <div className='absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]'>
            <BiSearch
              className='text-white'
              size={30}
            />
          </div>
        </div>
        <br />
        <br />
        <div className='1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center'>
          <Image
            src={require("../../../public/assets/client-1.jpg")}
            alt=''
            className='rounded-full'
          />
          <Image
            src={require("../../../public/assets/client-2.jpg")}
            alt=''
            className='rounded-full -m-2'
          />
          <Image
            src={require("../../../public/assets/client-3.jpg")}
            alt=''
            className='rounded-full '
          />
          <p className='font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]'>
            500K+ people already trusted us.{" "}
            <Link
              href='/courses'
              className='dark:text-[#46e256] text-[crimson]'>
              View Courses
            </Link>{" "}
          </p>
        </div>
        <br />
      </div>
    </div>
  );
};
export default Hero;
