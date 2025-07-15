import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../Pages/shared/Loading/Loading";
import useUserRole from "../hooks/useUserRole";
import { Navigate } from "react-router";

const AdminRoute = ({children}) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (!user || role !== "admin") {
    return (
      <Navigate
        to={"/forbidden-access"}
        state={{ from: location.pathname }}
      ></Navigate>
    );
  }

  return children;
};

export default AdminRoute;
