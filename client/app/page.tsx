"use client";
import React, { FC, use, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
interface Props {}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Heading
        title='ELearing'
        description='ELearning is a platform for students to learn and get help from teachers'
        keywords='programming, MERN, Redux, Machine Learning'
      />
      <Header
        open={open}
        activeItem={activeItem}
        setOpen={setOpen}
      />
      <Hero />
    </div>
  );
};

export default Page;
