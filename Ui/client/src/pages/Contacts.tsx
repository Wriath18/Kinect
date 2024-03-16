import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SidebarItems from "../components/SidebarItems";

const Contacts = () => {
  const [formData, setFormData] = useState({ targetId: "", targetEmail: "" });
  const { currentUser, loading } = useSelector((state: any) => state.user);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `/api/user/add-contacts/${currentUser._id}`,
        formData
      );
      console.log(response.data);
      setFormData({ targetId: "", targetEmail: "" });
      toast.success("Contact has been successfully added");
    } catch (error) {
      toast.error("Contact couldn't be added");
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <SidebarItems activeClass="contacts" />

      <div className="p-3 max-w-lg mx-auto flex-1">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            defaultValue=""
            id="targetId"
            placeholder="Contact ID"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            type="email"
            defaultValue=""
            id="targetEmail"
            placeholder="E-mail"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <button className="bg-slate-700 opacity-95 text-white p-3 rounded-lg uppercase hover:bg-slate-800 hover:opacity-100 disabled:opacity-80">
            {loading ? "Loading..." : "Add Contact"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contacts;
