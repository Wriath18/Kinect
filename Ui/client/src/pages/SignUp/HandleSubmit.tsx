import axios from "axios";

export interface FormData {
  username: string;
  email: string;
  password: string;
  isAdminAccount: string;
}

export const HandleSubmit = async (
  e: { preventDefault: () => void },
  formData: FormData,
  setLoading: (loading: boolean) => void,
  setError: (error: boolean) => void,
  navigate: (to: string) => void
) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError(false);
    const response = await axios.post("/api/auth/sign-up", formData);
    console.log(response.data);
    setLoading(false);

    navigate("/sign-in");
  } catch (error: any) {
    setLoading(false);
    setError(true);
    console.error(error.message);
  }
};

export default HandleSubmit;
