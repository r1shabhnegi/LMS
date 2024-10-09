import { styles } from "@/app/styles/style";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import e from "express";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  setOpen: (open: boolean) => void;
};
const AddMemberModal: FC<Props> = ({ setOpen }) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [updateUser, { isSuccess, error }] = useUpdateUserMutation();
  const { refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Member updated successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMsg = error as any;
        toast.error(errorMsg.data.message);
      }
    }
  }, [isSuccess, error]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (email === "" || role === "") {
      toast.error("Please fill all the fields!");
    } else {
      await updateUser({ email, role });
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-[24px] font-semibold pb-10'>Add New Member</h1>
      <form
        className='flex flex-col gap-5'
        onSubmit={(e) => handleSubmit(e)}>
        <input
          type='email'
          className='bg-transparent border border-gray-400 rounded h-9 text-[13px] w-72 p-2'
          placeholder='Enter email...'
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          name=''
          id=''
          className='bg-transparent hover:bg-none text-white border border-gray-400 rounded h-9 text-[13px] w-72 p-2'
          onChange={(e) => setRole(e.target.value)}>
          <option
            value='user'
            className='bg-gray-700 '>
            User
          </option>
          <option
            value='admin'
            className='bg-gray-700 hover:bg-none'>
            Admin
          </option>
        </select>
        <button
          type='submit'
          className={`${styles.button} !min-h-[38px] !py-0 text-sm mt-4`}>
          Submit
        </button>
      </form>
    </div>
  );
};
export default AddMemberModal;
