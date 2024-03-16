import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  UserRoundSearch,
  Key,
  Upload,
  HeartHandshake,
  BookA,
  Pill,
  Megaphone
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Sidebar, { SidebarItem } from "./Sidebar";

const SidebarItems = ({ activeClass }: { activeClass: string }) => {
  const { currentUser } = useSelector((state: any) => state.user);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Unique key has been copied to the clipboard!", {
        position: "top-center",
        className: "w-34",
      });
    } catch (error) {
      toast.error("An error has occurred");
    }
  };

  const handleClickUniqueKey = () => {
    console.log("run:", currentUser);

    if (currentUser._id) {
      copyToClipboard(currentUser._id);
    } else {
      console.log("Not available");
    }
  };

  const handleClickAlertKey = async () => {
    if (currentUser) {
      try {
        const response = await axios.get(`/api/user/prescription/${currentUser._id}`);
        const data = response.data;
        const { medicine } = data;
        toast.success(`You should take ${medicine[0]} now.`, {
          position: "top-center",
          className: "w-34"
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex">
        <Sidebar>
          <Link to="/">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              active={activeClass === "dashboard"}
            />
          </Link>

          <Link to="/contacts">
            <SidebarItem
              icon={<UserRoundSearch size={20} />}
              text="Contacts"
              active={activeClass === "contacts"}
            />
          </Link>

          <SidebarItem icon={<Calendar size={20} />} text="Calendar" />

          <SidebarItem
            icon={<Key size={20} />}
            text="Unique Key"
            clickable={handleClickUniqueKey}
          />

          <SidebarItem
            icon={<Megaphone size={20} />}
            text="Alert Medicine"
            clickable={handleClickAlertKey}
          />

          <Link to="/upload">
            <SidebarItem
              icon={<Upload size={20} />}
              text="Upload Prescription"
              active={activeClass === "upload"}
            />
          </Link>

          <Link to="/prescription">
            <SidebarItem
              icon={<Pill size={20} />}
              text="Current Prescription"
              active={activeClass === "prescription"}
            />
          </Link>
          <hr className="my-3" />

          <Link to="/profile">
            <SidebarItem
              icon={<Settings size={20} />}
              text="Profile"
              active={activeClass === "profile"}
            />
          </Link>

          <SidebarItem icon={<HeartHandshake size={20} />} text="Help" />

          <Link to="/about">
            <SidebarItem
              icon={<BookA size={20} />}
              text="About"
              active={activeClass === "about"}
            />
          </Link>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarItems;
