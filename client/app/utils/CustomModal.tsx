import { FC } from "react";
import { Modal, Box } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem?: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?: any;
};
const CustomModal: FC<Props> = ({
  open,
  setOpen,
  component: Component,
  setRoute,
  refetch,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      area-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box
        className={` ${
          setRoute ? "w-[450px]" : "w-auto"
        } absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/3  bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none`}>
        <Component
          setOpen={setOpen}
          setRoute={setRoute}
          refetch={refetch}
        />
      </Box>
    </Modal>
  );
};

export default CustomModal;
