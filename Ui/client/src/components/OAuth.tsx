import axios from "axios";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const requestBody = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
      const response = await axios.post("/api/auth/google", requestBody);

      dispatch(signInSuccess(response.data));
      navigate("/");
    } catch (error) {
      console.log("Couldn't login with Google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
    >
      <img src="/google.svg" alt="Google Img" className="w-6 h-6 inline mr-2" />
      Sign in with Google
    </button>
  );
};

export default OAuth;
