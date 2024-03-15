import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import LoginImage from "./LoginImage";
import OAuth from "../../components/OAuth";
import { inputFields } from "./inputFields";
import { useHandleChange } from "./HandleChange";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData, handleChange } = useHandleChange();
  const { loading, error } = useSelector((state: any) => state.user);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.post("/api/auth/sign-in", formData);
      dispatch(signInSuccess(response.data));
      navigate("/");
    } catch (error: any) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Welcome</span>
          <span className="font-light text-gray-400 mb-8">
            Please enter your details below to login
          </span>

          <form onSubmit={handleSubmit}>
            {inputFields.map(
              (field: { placeholder: string; type: string; id: string }) => (
                <div className="py-4" key={field.id}>
                  <input
                    {...field}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  />
                </div>
              )
            )}

            <div className="flex justify-between w-full py-4">
              <div className="mr-24">
                <input type="checkbox" name="ch" id="ch" className="mr-2" />
                <span className="text-md">Remember for 30 days</span>
              </div>
              <span className="font-semibold text-md text-blue-600">
                Forgot password?
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
            <OAuth />
          </form>

          <div className="text-gray-400 flex gap-2">
            <p className="text-center">Don&apos;t have an account?</p>
            <Link to="/sign-up">
              <span className="font-semibold text-blue-500">Sign Up</span>
            </Link>
          </div>
          <p className="text-red-700 mt-5 text-center font-semibold">
            {error
              ? "Error: " + error.response.data.message || "An error occurred"
              : ""}
          </p>
        </div>

        <LoginImage />
      </div>
    </div>
  );
};

export default SignIn;
