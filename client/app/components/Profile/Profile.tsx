"use client";
import { FC, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";

type Props = { user: any };
const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, { skip: !logout ? true : false });

  const logoutHandler = async () => {
    await signOut();
    setLogout(true);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <div className='w-[85%] flex mx-auto'>
      <div
        className={`w-[60px] 800px:w-[310px] h-screen dark:bg-[#202020] bg-white bg-opacity-90 border dark:border-[#686868ce] border-[#00000014] rounded-[5px] dark:shadow-sm shadow-xl  mt-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        }`}>
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
      {active === 1 && (
        <div className='w-full h-full bg-transparent mt-[80px]'>
          <ProfileInfo
            avatar={avatar}
            user={user}
          />
        </div>
      )}
      {active === 2 && (
        <div className='w-full h-full bg-transparent mt-[80px]'>
          <ChangePassword />
        </div>
      )}
    </div>
  );
};
export default Profile;
