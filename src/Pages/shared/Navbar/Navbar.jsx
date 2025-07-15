import React from "react";
import { Link, NavLink } from "react-router";
import Logo from "../Logo/Logo";
import upArrow from "../../../assets/up .png";
import useAuth from "../../../hooks/useAuth";
const Navbar = () => {
  const { user, logOut } = useAuth();
  const navItems = (
    <>
      <li>
        <NavLink to={"/"}>Home</NavLink>
      </li>
      <li>
        <NavLink to={"/coverege"}>Coverege</NavLink>
      </li>
      <li>
        <NavLink to={"/send-parcel"}>Send Parcel</NavLink>
      </li>

      {user && (
        <li>
          <NavLink to={"/dashboard"}>Dashboard</NavLink>
        </li>
      )}

      <li>
        <NavLink to={"/be-rider"}>Be a Rider</NavLink>
      </li>
      <li>
        <NavLink to={"/about"}>About</NavLink>
      </li>
    </>
  );

  const handleLogOut = () => {
    logOut()
      .then(() => {
        console.log("logged out successful");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="pt-5">
      <div className="navbar max-w-7xl mx-auto bg-base-100 shadow-sm rounded-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navItems}
            </ul>
          </div>
          <Logo></Logo>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end space-x-2">
          {user ? (
            <div>
              <div className="avatar w-10">
                <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                  <img
                    src={
                      user?.photoURL
                        ? user?.photoURL
                        : "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                    }
                  />
                </div>
              </div>
              <button onClick={handleLogOut} className="btn ml-3">
                Logout
              </button>
            </div>
          ) : (
            <Link to={"/login"} className="btn">
              Singin
            </Link>
          )}

          <Link to={'/be-rider'} className="btn btn-primary text-black">Be a rider</Link>
          <img src={upArrow} className="w-10" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
