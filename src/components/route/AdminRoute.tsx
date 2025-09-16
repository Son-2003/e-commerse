import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@redux/store";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
