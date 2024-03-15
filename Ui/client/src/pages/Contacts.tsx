import { useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

import SidebarItems from "../components/SidebarItems";

const Contacts = () => {
  return (
    <div className="flex flex-row h-screen">
      <SidebarItems activeClass="contacts" />
      <p>contacts</p>
    </div>
  );
};

export default Contacts;
