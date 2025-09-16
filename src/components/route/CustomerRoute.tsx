import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@redux/store";
import { RoleType } from "common/enums/RoleType";

const CustomerRoute = ({ children }: { children: JSX.Element }) => {
  const { adminInfo } = useSelector((state: RootState) => state.auth);

  if (adminInfo?.role !== RoleType.CUSTOMER) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default CustomerRoute;
