import { useState } from "react";

export interface FormData {
  username: string;
  email: string;
  password: string;
  isAdminAccount: string;
}

export const useHandleChange = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    isAdminAccount: "",
  });

  const handleChange = (e: { target: { id: string; value: string } }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return { formData, handleChange };
};
