import { styles } from "@/app/styles/style";
import { FC } from "react";
import { AddCircle } from "@mui/icons-material";
import toast from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  active,
  benefits,
  prerequisites,
  setActive,
  setBenefits,
  setPrerequisites,
}) => {
  const handleBenefitChange = (index: number, value: any) => {
    // console.log("rishabh");
    const updatedBenefits = benefits.map((benefit: any, i: number) =>
      i === index ? { ...benefit, title: value } : benefit
    ); // Deep clone
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };
  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index: number, value: any) => {
    const updatedPrerequisites = prerequisites.map(
      (prerequisite: any, i: number) =>
        i === index ? { ...prerequisite, title: value } : prerequisite
    );
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill the fields for go to next!");
    }
  };

  return (
    <div className='w-[80%] m-auto mt-24 block'>
      <div>
        <label
          className={`${styles.label} text-[20px]`}
          htmlFor='email'>
          What are the benefits for students in this course
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type='text'
            key={index}
            name='benefit'
            placeholder='You will be able to build a full stack LMS platform...'
            required
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => {
              handleBenefitChange(index, e.target.value);
            }}
          />
        ))}
        <AddCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
      </div>
      <div>
        <label
          className={`${styles.label} text-[20px]`}
          htmlFor='email'>
          What are the prerequisites for students in this course
        </label>
        <br />
        {prerequisites.map((prerequisite: any, index: number) => (
          <input
            type='text'
            key={index}
            name='prerequisite'
            placeholder='You need basic knowledge of MERN stack'
            required
            className={`${styles.input} my-2`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <AddCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisite}
        />
      </div>
      <div className='w-full flex items-center justify-between'>
        <div
          className='w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer'
          onClick={() => prevButton()}>
          Prev
        </div>
        <div
          className='w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer'
          onClick={() => handleOptions()}>
          Next
        </div>
      </div>
    </div>
  );
};
export default CourseData;
