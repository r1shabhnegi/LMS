import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import CourseDetails from "./CourseDetails";

type Props = {
  id: string;
};
const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data?.course.name + " - ELearning"}
            description='ELearning is a programming community which is developed by Rishabh Negi for helping programmers'
            keywords={data?.course.tags}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <CourseDetails data={data.course} />
        </div>
      )}
    </>
  );
};
export default CourseDetailsPage;
