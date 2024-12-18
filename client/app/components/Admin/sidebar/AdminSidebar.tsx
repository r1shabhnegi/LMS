"use client";
import { FC, useEffect, useState } from "react";

import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
} from "./Icons";

import "react-pro-sidebar/dist/css/styles.css";
import avatarDefault from "@/public/assets/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}
const Item: FC<itemProps> = ({ icon, selected, setSelected, title, to }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}>
      <Typography className='!text-[16px] !font-Poppins'>{title}</Typography>
      <Link href={to}></Link>
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }
  const logoutHandler = () => {
    setLogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${
            theme === "dark" ? "#202020 !important" : " #fff !important"
          }`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-menu-item": {
          color: `${theme !== "dark" && "#000"}`,
        },
      }}
      className='!bg-white dark:bg-[#202020] z-[999999]'>
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "16%",
        }}>
        <Menu iconShape='square'>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{ margin: "10px 0 20px 0" }}>
            {!isCollapsed && (
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                ml='15px'>
                <Link href='/'>
                  <h3 className='text-[25px] font-Poppins uppercase dark:text-white text-black'>
                    LearnNow
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className='inline-block'>
                  <ArrowBackIosIcon className='text-black dark:text-[#ffffffc1]' />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb='25px'>
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'>
                <Image
                  width={100}
                  height={0}
                  src={user.avatar ? user.avatar.url : avatarDefault}
                  className='rounded-full object-contain'
                  alt=''
                  style={{
                    cursor: "pointer",
                    // borderRadius: "100%",
                    border: "2px solid #5b6fe6",
                  }}
                />
              </Box>
              <Box textAlign='center'>
                <Typography
                  variant='h4'
                  className='!text-[20px] text-black dark:text-[#ffffffc1]'
                  sx={{ m: "10px 0 0 0" }}>
                  {user?.name}
                </Typography>
                <Typography
                  variant='h6'
                  sx={{ m: "10px 0 0 0" }}
                  className='!text-[20px] text-black dark:text-[#ffffffc1] capitalize'>
                  {" "}
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title='Dashboard'
              to='/admin'
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant='h5'
              sx={{ m: "15px 0 5px 20px" }}
              className='!item-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title='Users'
              to='/admin/users'
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Invoices'
              to='/admin/invoices'
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant='h5'
              sx={{ m: "15px 0 5px 20x" }}
              className='!item-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title='Create Course'
              to='/admin/create-course'
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Live Course'
              to='/admin/courses'
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant='h5'
              sx={{ m: "15px 0 5px 20x" }}
              className='!item-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Customization  "}
            </Typography>
            <Item
              title='Hero'
              to='/admin/hero'
              icon={<WebIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='FAQ'
              to='/admin/faq'
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Categories'
              to='/admin/categories'
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant='h5'
              sx={{ m: "15px 0 5px 20x" }}
              className='!item-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Controllers  "}
            </Typography>
            <Item
              title='Manage Team'
              to='/admin/team'
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant='h5'
              sx={{ m: "15px 0 5px 20x" }}
              className='!item-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Analytics"}
            </Typography>

            <Item
              title='Courses Analytics'
              to='/admin/courses-analytics'
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title='Orders Analytics'
              to='/admin/orders-analytics'
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title='Users Analytics'
              to='/admin/users-analytics'
              icon={<ManageHistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <Typography
              variant='h5'
              sx={{ m: "15px 0 5px 20x" }}
              className='!item-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Extras"}
            </Typography> */}

            {/* <Item
              title='Settings'
              to='/admin/settings'
              icon={<SettingsIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
