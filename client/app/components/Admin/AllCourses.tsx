import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCoursesAdminQuery,
} from "@/redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import Link from "next/link";

const AllCourses = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesAdminQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "  ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <button>
            <Link
              className='mt-5'
              href={`/admin/edit-course/${params.row.id}`}>
              <FiEdit2
                className='dark:text-white text-black'
                size={20}
              />
            </Link>
          </button>
        );
      },
    },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setCourseId(params.row.id);
              }}>
              <AiOutlineDelete
                className='dark:text-white text-black'
                size={20}
              />
            </Button>
          </>
        );
      },
    },
  ];
  const rows: any = [
    //   {
    //     id: "1234",
    //     title: "React",
    //     purchased: "38",
    //     ratings: "5",
    //     created_at: "12/12/12",
    //   },
  ];
  {
    data &&
      data.courses.forEach((item: any) => {
        rows.push({
          id: item._id,
          title: item.name,
          purchased: item.purchased,
          ratings: item.ratings,
          created_at: format(item.createdAt),
        });
      });
  }
  const [deleteCourse, { error, isSuccess }] = useDeleteCourseMutation();
  useEffect(() => {
    if (isSuccess) {
      refetch();
      setOpen(!open);
      toast.success("Course Deleted Successfully");
    }

    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);
  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };
  return (
    <div className='mt-[120px]'>
      <Box m='20px'>
        {isLoading ? (
          <Loader />
        ) : (
          <Box
            m='40px 0 0 0'
            height='80vh'
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },

              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },

              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },

              "& .MuiDataGrid-row--borderBottom": {
                background:
                  theme === "dark" ? "#3E4396!important" : "#A4A9FC!important",
              },

              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                BorderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },

              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#a4a9fc",
                BorderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
              },

              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#a4a9fc",
                borderTop: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },

              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? "#b7ebde !important" : "#000 !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#fff !important",
              },
            }}>
            <DataGrid
              checkboxSelection
              rows={rows}
              columns={columns}
            />
          </Box>
        )}
      </Box>
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(!open)}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'>
          <Box className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/3  bg-white dark:bg-slate-900 rounded-[8px] !w-[350px] shadow p-4 outline-none'>
            <h1 className={`${styles.title}`}>
              Are you sure you want to delete this course?
            </h1>
            <div className='flex w-full items-center justify-between mb-6 mt-3'>
              <div
                className={`${styles.button} !w-[120px] h-[30px] !bg-[#57c793]`}
                onClick={() => setOpen(!open)}>
                Cancel
              </div>
              <div
                className={`${styles.button} !w-[120px] h-[30px] !bg-[#950e0e]`}
                onClick={handleDelete}>
                Delete
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};
export default AllCourses;
