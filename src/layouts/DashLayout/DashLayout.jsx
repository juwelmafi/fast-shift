import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import Logo from "../../Pages/shared/Logo/Logo";
import {
  FaHome,
  FaBoxOpen,
  FaHistory,
  FaLocationArrow,
  FaUserEdit,
  FaMotorcycle,
  FaUserClock,
} from "react-icons/fa";

const DashLayout = () => {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar for small screen */}
          <div className="navbar bg-base-300 lg:hidden">
            <div className="flex-none">
              <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2">
              <Logo></Logo>
            </div>
          </div>

          {/* Page Content */}
          <Outlet></Outlet>
        </div>

        {/* Sidebar (left) */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 md:w-72 w-54 min-h-full bg-base-200 text-base-content">
            {/* Sidebar Items */}
            <Logo></Logo>
            <li>
              <NavLink to={"/"}>
                <FaHome className="inline-block mr-2" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/my-parcels"}>
                <FaBoxOpen className="inline-block mr-2" /> My Parcels
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/payment-history"}>
                <FaHistory className="inline-block mr-2" /> Payment History
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/track"}>
                <FaLocationArrow className="inline-block mr-2" /> Track a
                Package
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/profile"}>
                <FaUserEdit className="inline-block mr-2" /> Update Profile
              </NavLink>
            </li>

            {/* Rider links */}
            <li>
              <NavLink to={"/dashboard/active-riders"}>
                <FaMotorcycle className="inline-block mr-2" /> Active Riders
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/pending-riders"}>
                <FaUserClock className="inline-block mr-2" /> Pending Riders
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashLayout;
