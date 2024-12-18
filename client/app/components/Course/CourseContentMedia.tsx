import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import avatar from "@/public/assets/avatar.png";
import toast from "react-hot-toast";
import {
  courseApi,
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import { Key } from "@mui/icons-material";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};
const CourseContentMedia = ({
  activeVideo,
  data,
  id,
  user,
  setActiveVideo,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionCreationLoading },
  ] = useAddNewQuestionMutation();

  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();

  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();

  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const course = courseData?.course;

  const [
    addReplyInReview,
    {
      isSuccess: replySuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation();
  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Question added successfully!");
      refetch();

      socketId.emit("notification", {
        title: "New Question Received",
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
      setQuestion("");
    }
    if (answerSuccess) {
      toast.success("Answer added successfully!");
      refetch();
      setAnswer("");
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: "New Reply Received",
          message: `You have a new question reply in ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }
    if (error) {
      if ("data" in error) {
        const errorMsg = error as any;
        toast.error(errorMsg.data.message);
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMsg = answerError as any;
        toast.error(errorMsg.data.message);
      }
    }

    if (reviewSuccess) {
      toast.success("Review added successfully!");
      courseRefetch();
      setReview("");
      setRating(1);
      socketId.emit("notification", {
        title: "New Question Received",
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }

    if (reviewError) {
      if ("data" in reviewError) {
        const errorMsg = reviewError as any;
        toast.error(errorMsg.data.message);
      }
    }
    if (replySuccess) {
      toast.success("Reply added successfully!");
      courseRefetch();
      setReview("");
    }

    if (replyError) {
      if ("data" in replyError) {
        const errorMsg = replyError as any;
        toast.error(errorMsg.data.message);
      }
    }
  }, [
    isSuccess,
    error,
    answerError,
    answerSuccess,
    reviewError,
    reviewSuccess,
    replyError,
    replySuccess,
  ]);

  const handleQuestion = async () => {
    if (question.length === 0) {
      toast.error("Question can't be empty");
    } else {
      await addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId,
    });
  };
  //   console.log(questionId);

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = async () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Reply cannot be empty");
      } else {
        await addReplyInReview({ comment: reply, courseId: id, reviewId });
      }
    }
  };
  return (
    <div className='w-[95%] 800px:w-[86%] py-4 m-auto'>
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />
      <div className='w-full flex items-center justify-between my-3'>
        <div
          className={`${
            styles.button
          } text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }>
          <AiOutlineArrowLeft className='mr-2' />
          Prev Lesson
        </div>
        <div
          className={`${
            styles.button
          } text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }>
          Next Lesson
          <AiOutlineArrowRight className='mr-2' />
        </div>
      </div>
      <h1 className='pt-2 text-black dark:text-white text-[25px] font-[600]'>
        {data[activeVideo].title}
      </h1>
      <br />
      <div className='w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner'>
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`800px:text-[20px]  cursor-pointer ${
              activeBar === index
                ? "text-red-500"
                : "text-black dark:text-white"
            }`}
            onClick={() => setActiveBar(index)}>
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className='text-black dark:text-white text-[18px] whitespace-pre-line mb-3'>
          {data[activeVideo]?.description}
        </p>
      )}

      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div
              className='mb-5'
              key={index + item}>
              <h2 className='800px:text-[20px] 800px:inline-block dark:text-white text-black'>
                {item.title && item.title + " :"}
              </h2>
              <a
                href={item.url}
                className='inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2'>
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className='flex w-full'>
            <Image
              src={user.avatar ? user.avatar.url : avatar}
              alt=''
              width={50}
              height={50}
              className='w-[50px] h-[50px] rounded-full object-cover'
            />
            <textarea
              name=''
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=''
              cols={40}
              rows={5}
              placeholder='Write your question...'
              className='outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins'
            />
          </div>
          <div className='w-full flex justify-end'>
            <div
              className={`${
                styles.button
              } !w-[120px] !h-[40px] text-[18px] mt-5 ${
                questionCreationLoading ? "cursor-not-allowed" : ""
              }`}
              onClick={questionCreationLoading ? () => {} : handleQuestion}>
              Submit
            </div>
          </div>
          <br />
          <br />
          <div className='w-full h-[1px] bg-[#ffffff3b]'></div>
          <div>
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}

      {activeBar === 3 && (
        <div className='w-full'>
          <>
            {!isReviewExists && (
              <>
                <div className='flex w-full'>
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt=''
                    width={50}
                    height={50}
                    className='w-[50px] h-[50px] rounded-full object-cover'
                  />
                  <div className='w-full'>
                    <h5 className='pl-3 text-[20px] font-[500 dark:text-white text-black]'>
                      Give a Rating <span className='text-red-500'>*</span>
                    </h5>
                    <div className='flex w-full ml-2 pb-3'>
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className='mr-1 cursor-pointer'
                            color='rgb(246,186,0)'
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className='mr-1 cursor-pointer'
                            color='rgb(246, 186, 0)'
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=''
                      id=''
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      cols={40}
                      rows={5}
                      placeholder='Write your comment...'
                      className='outline-none bg-transparent 800px:ml-3 border border-[#ffffff57] w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins'></textarea>
                  </div>
                </div>
                <div className='w-full flex  justify-end'>
                  <div
                    className={`${
                      styles.button
                    } !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${
                      reviewCreationLoading && "cursor-no-drop"
                    }`}
                    onClick={
                      reviewCreationLoading ? () => {} : handleReviewSubmit
                    }>
                    Submit
                  </div>
                </div>
              </>
            )}
            <br />
            <div className='w-full h-[1px] bg-[#ffffff3b]'></div>
            <div className='w-full'>
              {(course?.reviews && [...course.reviews].reverse())?.map(
                (item: any, index: number) => (
                  <div
                    className='w-full my-5 dark:text-white text-black'
                    key={index + item?.user.name}>
                    <div className='w-full flex'>
                      <Image
                        src={user.avatar ? user.avatar.url : avatar}
                        alt=''
                        width={50}
                        height={50}
                        className='w-[50px] h-[50px] rounded-full object-cover'
                      />
                      <div className='ml-2'>
                        <h1 className='text-[18px]'>{item?.user.name}</h1>
                        <Ratings rating={item.rating} />
                        <p>{item.comment}</p>
                        <small className='text-[#0000009e] dark:text-[#ffffff83]'>
                          {format(item.createdAt)} •
                        </small>
                      </div>
                    </div>
                    {user.role === "admin" && (
                      <span
                        className={`${styles.label} !ml-10 cursor-pointer`}
                        onClick={() => {
                          setIsReviewReply(true);
                          setReviewId(item._id);
                        }}>
                        Add Reply
                      </span>
                    )}
                    {isReviewReply && (
                      <div className='w-full flex relative'>
                        <input
                          type='text'
                          value={reply}
                          onChange={(e: any) => setReply(e.target.value)}
                          className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-black dark:border-[#fff] p-[5px] w-[90%] `}
                        />
                        <button
                          type='submit'
                          className='absolute right-0 buttom-1'
                          onClick={handleReviewReplySubmit}>
                          Submit
                        </button>
                      </div>
                    )}
                    {item.commentReplies.map((i: any, index: number) => (
                      <div
                        key={index}
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
            {/* <br /> */}
          </>
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className='w-full my-3'>
        {data[activeVideo].questions.map((item: any, index: number) => (
          <CommentItem
            data={data}
            Key={index}
            activeVideo={activeVideo}
            answer={answer}
            setAnswer={setAnswer}
            item={item}
            index={index}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  data,
  activeVideo,
  item,
  answer,
  setAnswer,
  setQuestionId,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <>
      <div className='my-4'>
        <div className='flex mb-2'>
          <Image
            src={item.user.avatar ? item.user.avatar.url : avatar}
            alt=''
            width={50}
            height={50}
            className='w-[50px] h-[50px] rounded-full object-cover'
          />
          {/* <div className='w-[50px] h-[50px]'>
            <div className='w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer'>
              <h1 className='uppercase text-[18px]'>
                {item?.user.name.slice(0, 2)}
              </h1>
            </div>
          </div> */}
          <div className='pl-3 dark:text-white text-black'>
            <h5 className='text-[20px]'>{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className='text-black text-[#ffffff83]'>
              {format(item?.createdAt)} •
            </small>
          </div>
        </div>
        <div className='w-full flex'>
          <span
            className='800px:pl-16 text-black dark:text-[#ffffff83] cursor-pointer mr-2'
            onClick={() => {
              setReplyActive(!replyActive);

              setQuestionId(item._id);
            }}>
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className='cursor-pointer dark:text-[#ffffff83] text-black'
          />
          <span className='pl-1 mt-[-4px] cursor-pointer text-black text-[#ffffff83]'>
            {item.questionReplies.length}
          </span>
        </div>
        {replyActive && (
          <>
            {item.questionReplies.map((item: any) => (
              <div
                key={item + Math.random() + 100}
                className='w-full flex 800px:ml-16 my-5 text-black dark:text-white'>
                <div>
                  <Image
                    src={item.user.avatar ? item.user.avatar.url : avatar}
                    alt=''
                    width={50}
                    height={50}
                    className='w-[50px] h-[50px] rounded-full object-cover'
                  />
                </div>
                <div className='pl-3'>
                  <div className='flex items-center'>
                    <h5 className='text-[20px]'>{item.user.name}</h5>
                    {item.user.role === "admin" && (
                      <MdVerified className='text-[#25c825] ml-2 text-[20px]' />
                    )}
                  </div>
                  <p>{item.answer}</p>
                  <small className='text-[#ffffff83]'>
                    {format(item.createdAt)}
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className='w-full flex relative dark:text-white text-black'>
                <input
                  type='text'
                  placeholder='Enter your answer...'
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
                  className={`block 800px:ml-12 mt-2 outline bg-transparent !border-b border-[#00000027] text-black dark:border-[#fff] dark:text-white p-[5px] w-[95%] ${
                    answer === "" ||
                    (answerCreationLoading && "cursor-not-allowed")
                  }`}
                />

                <button
                  type='submit'
                  className='absolute right-0 bottom-1'
                  onClick={handleAnswerSubmit}
                  disabled={answer === "" || answerCreationLoading}>
                  Submit
                </button>
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
};
export default CourseContentMedia;
