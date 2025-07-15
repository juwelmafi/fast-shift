import React from "react";
import useUserRole from "../../../hooks/useUserRole";
import Loading from "../../shared/Loading/Loading";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import ForbiddenAccess from "../../Forbidden/ForbiddenAccess";

const DashBoardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading></Loading>;
  } else if (role === "user") {
    return <UserDashboard></UserDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else <ForbiddenAccess></ForbiddenAccess>;
};

export default DashBoardHome;
