import React, { FC, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";

type Props = {
  isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const { isLoading, data, error } = useGetAllUsersQuery({});
  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.3 },
    { field: "courses", headerName: "Purchased courses", flex: 0.4 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },

    {
      field: "  ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button>
              <AiOutlineDelete
                className='dark:text-white text-black'
                size={20}
              />
            </Button>
          </>
        );
      },
    },
    {
      field: " ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button>
              <a href={`mailto:${params.row.email}`}>
                <AiOutlineMail
                  className='dark:text-white text-black'
                  size={20}
                />
              </a>
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

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          courses: item.courses,
          role: item.role,
          email: item.email,
          created_at: format(item.createdAt),
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          courses: item.courses,
          role: item.role,
          email: item.email,
          created_at: format(item.createdAt),
        });
      });
  }

  {
  }

  return (
    <div className='mt-[120px]'>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m='20px'>
          <div className='w-full flex justify-end'>
            <div
              className={`${styles.button} !h-[35px] !w-[200px] dark:bg-[#57c7a3] dark:border-[#ffffff6c]`}
              onClick={() => setActive(!active)}>
              Add New Member
            </div>
          </div>
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
        </Box>
      )}
    </div>
  );
};
export default AllUsers;
