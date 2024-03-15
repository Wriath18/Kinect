import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state: any) => state.user);

  return currentUser !== null ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
