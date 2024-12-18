import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import avatar from "@/public/assets/avatar.png";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import { useEffect, useState } from "react";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = { data: any; setRoute: any; setOpen: any };
const CourseDetails = ({ data, setOpen: openAuthModel, setRoute }: Props) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>();
  const { data: userData } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const [createOrder, { isSuccess, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Purchased Successfully!");
      setOpen(!open);
      socketId.emit("notification", {
        title: "New Order",
        message: `You have a new order from ${data.name}`,
        userId: userData._id,
      });
      redirect(`/course-access/${data?._id}`);
    }
    if (error) {
      if ("data" in error) {
        const errorMsg = error as any;
        toast.error(errorMsg.data.message);
      }
    }
  }, [isSuccess, error]);

  const discountPercentage =
    data?.estimatedPrice && data?.estimatedPrice !== 0
      ? ((data.estimatedPrice - data?.price) / data.estimatedPrice) * 100
      : 0;

  const discountPercentagePrice = discountPercentage.toFixed(2);

  const isPurchased =
    user && user?.courses?.find((item: any) => item.courseId === data._id);

  const handleOrder = (e: any) => {
    if (user) {
      setOpen(!open);
    } else {
      setRoute("Login");
      openAuthModel(true);
    }
  };
  // console.log(data);/
  const handlePayment = async () => {
    await createOrder({ courseId: data._id });
  };

  return (
    <div>
      <div className='w-[90%] 800px:w-[90%] m-auto py-5'>
        <div className='w-full flex flex-col-reverse 800px:flex-row'>
          <div className='w-full 800px:w-[65%] 800px:pr-5'>
            <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>
              {data.name}
            </h1>
            <div className='flex items-center justify-between pt-3'>
              <div className='flex items-center'>
                <Ratings rating={data.ratings} />
                <h5 className='text-black dark:text-white'>
                  {data?.reviews?.length} Reviews
                </h5>
              </div>
              <h5
                className='
          text-black dark:text-white'>
                {data.purchased} Students
              </h5>
            </div>
            <br />
            <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>
              What you will learn from this course?
            </h1>
            <div>
              {data?.benefits?.map((item: any, index: number) => (
                <div
                  className='w-full flex 800px:items-center py-2'
                  key={index + item}>
                  <div className='w-[15px] mr-1'>
                    <IoCheckmarkDoneOutline
                      size={20}
                      className='text-black dark:text-white'
                    />
                  </div>
                  <p className='pl-2 text-black dark:text-white'>
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>
              What are the prerequisites for starting this course?
            </h1>
            {data?.prerequisites?.map((item: any, index: number) => (
              <div
                className='w-full flex 800px:items-center py-2'
                key={index}>
                <div className='w-[15px] mr-1'>
                  <IoCheckmarkDoneOutline
                    size={20}
                    className='text-black dark:text-white'
                  />
                </div>
                <p className='pl-2 text-black dark:text-white'>{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>
                Course Overview
              </h1>
              <CourseContentList
                data={data?.courseData}
                isDemo={true}
              />
            </div>
            <br />
            <br />
            {/* Course Description */}
            <div className='w-full'>
              <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>
                Course Details
              </h1>
              <p className='text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white'>
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className='w-full'>
              <div className='800px:flex items-center'>
                <Ratings rating={data?.ratings} />
                <div className='mb-2 800px:mb-[unset]' />
                <h5 className='text-[25px] font-Poppins text-black dark:text-white'>
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating • {data?.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div
                    className='w-full pb-4'
                    key={index}>
                    <div className='flex'>
                      <div className='w-[50px] h-[50px]'>
                        <Image
                          src={item.user.avatar ? item.user.avatar.url : avatar}
                          alt=''
                          width={50}
                          height={50}
                          className='w-[50px] h-[50px] rounded-full object-cover'
                        />
                      </div>
                      <div className='hidden 800px:block pl-2'>
                        <div className='flex items-center'>
                          <h5 className='text-[18px] pr-2 text-black dark:text-white'>
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className='text-black dark:text-white'>
                          {item.comment}
                        </p>
                        <small className='text-[#000000d1] dark:text-[#ffffff83]'>
                          {format(item.createdAt)} •
                        </small>
                      </div>
                      <div className='pl-2 flex 800px:hidden items-center'>
                        <h5 className='text-[18px] pr-2 text-black dark:text-white'>
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                    </div>
                    {item.commentReplies.map((i: any, index: number) => (
                      <div
                        key={index + i.comment}
                        className='w-full flex 800px:ml-16 my-5'>
                        <div className='w-[50px] h-[50px]'>
                          <Image
                            src={i.user.avatar ? i.user.avatar.url : avatar}
                            alt=''
                            width={50}
                            height={50}
                            className='w-[50px] h-[50px] rounded-full object-cover'
                          />
                        </div>
                        <div className='pl-2'>
                          <div className='flex items-center'>
                            <h5 className='text-[20px]'>{i.user.name}</h5>
                            {i.user.role === "admin" && (
                              <MdVerified className='text-[#25c825] ml-2 text-[20px]' />
                            )}
                          </div>
                          <p>{i.comment}</p>
                          <small className='text-[#ffffff83]'>
                            {format(i.createdAt)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
          <div className='w-full 800px:w-[35%] relative'>
            <div className='sticky top-[100px] left-0 z-[50] w-full'>
              <CoursePlayer
                title={data?.title}
                videoUrl={data?.demoUrl}
              />
              <div className='flex items-center'>
                <h1 className='pt-5 text-[25px] text-black dark:text-white'>
                  {data.price === 0 ? "Free" : data.price + "$"}
                </h1>
                <h5 className='pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white'>
                  {data.estimatedPrice}$
                </h5>
                <h4 className='pl-5 pt-4 text-[20px] text-black dark:text-white'>
                  {discountPercentagePrice}% Off
                </h4>
              </div>
              <div className='flex items-center'>
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}>
                    Enter to Course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={handleOrder}>
                    Buy Now {data.price}$
                  </div>
                )}
              </div>
              <br />
              <p className='pb-1 text-black dark:text-white'>
                • Source code included
              </p>
              <p className='pb-1 text-black dark:text-white'>
                • Full lifetime access
              </p>
              <p className='pb-1 text-black dark:text-white'>
                • Certificate of completion
              </p>
              <p className='pb-3 800px:pb-1 text-black dark:text-white'>
                • Premium Support
              </p>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className='w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center'>
            <div className='w-[500px] h-min bg-white rounded-xl shadow p-3'>
              <div className='w-full flex justify-end'>
                <IoCloseOutline
                  size={40}
                  className='text-black cursor-pointer'
                  onClick={() => setOpen(false)}
                />
              </div>

              <br />
              <div className='flex flex-col'>
                <div>
                  <h1 className='text-black font-semibold !text-xl'>
                    {data.name}
                  </h1>
                  <br />
                  <p className='pb-1 ml-2 text-black'>• Source code included</p>
                  <p className='pb-1 ml-2 text-black'>• Full lifetime access</p>
                  <p className='pb-1 ml-2 text-black'>
                    • Certificate of completion
                  </p>
                  <p className='pb-3 ml-2 800px:pb-1 text-black'>
                    • Premium Support
                  </p>
                </div>
                <br />
                <br />
                <div className='text-black items-center flex justify-between'>
                  <div>
                    <h1 className={`${styles.label} !text-black !text-xl`}>
                      Total price - {data.estimatedPrice}$
                    </h1>
                  </div>
                  <button
                    className={`${styles.button} !w-max`}
                    onClick={handlePayment}>
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};
export default CourseDetails;
