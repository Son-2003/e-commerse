import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
