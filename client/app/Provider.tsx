import React, { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

interface ProviderProps {
  children: ReactNode;
}
export const Providers: FC<ProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
