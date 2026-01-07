import { authState } from "@/redux/slice/authSlice";

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector(authState);

  if (!user.user.user_id) {
    return <Navigate to={"/onboarding"} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
