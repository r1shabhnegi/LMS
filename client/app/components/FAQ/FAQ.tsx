import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { styles } from "@/app/styles/style";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};
const FAQ = (props: Props) => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setACtiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: any) => {
    setACtiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <>
      <div className='w-[90%] 800px:w-[80%] m-auto mt-[120px]'>
        <h1 className={`${styles.title} 800px:text-[40px]`}>
          Frequently Asked Questions
        </h1>
        <div className='mt-12'>
          <dl className='space-y-8'>
            {questions.map((q: any) => (
              <div
                key={q._id}
                className={`${
                  q._id !== questions[0]?._id && "border-t"
                } border-gray-200 pt-6`}>
                <dt className='text-lg'>
                  <button
                    className='flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none'
                    onClick={() => toggleQuestion(q._id)}>
                    <span className='font-medium text-black dark:text-white'>
                      {q.question}
                    </span>
                    <span className='ml-6 flex-shrink-0'>
                      {q.active ? (
                        <HiMinus className='h-6 w-6' />
                      ) : (
                        <HiPlus className='h-6 w-6' />
                      )}
                    </span>
                  </button>
                </dt>
                {activeQuestion === q._id && (
                  <dd className='mt-2 pr-12'>
                    <p className='text-base font-Poppins text-black dark:text-white'>
                      {q.answer}
                    </p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
        <br />
        <br />
        <br />
      </div>
      )
    </>
  );
};
export default FAQ;
