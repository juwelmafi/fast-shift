import React from "react";
import { Outlet } from "react-router";
import authImage from "../../assets/authImage.png";
import Logo from "../../Pages/shared/Logo/Logo";

const AuthLayout = () => {

 

  return (
    <div className="p-12">
      <div>
        <Logo></Logo>
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex-1">
          <img src={authImage} className="" />
        </div>
        <div className="flex-1">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
