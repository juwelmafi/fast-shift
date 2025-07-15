import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogIn from "./SocialLogin/SocialLogIn";
import useAuth from "../../hooks/useAuth";
const LogIn = () => {
  const {signInUser} = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location =useLocation();
 const from = location.state?.from || "/"

  const onSubmit = (data) => {
    console.log(data);
    signInUser(data?.email, data?.password)
    .then((res)=>{
      console.log(res.user)
      navigate(from)
    })
    .catch(error=>{
      console.log(error)
    })
  };

  

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="font-bold text-3xl py-5">Welcome back!</h2>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input"
            placeholder="Email"
          />
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">Password required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">Password must be minimum 6 charecter</p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
        </fieldset>
        <button className="btn w-[20rem] btn-primary text-black mt-4">Login</button>
        <p className="mt-2">
          Don't have an account?{" "}
          <Link to={"/register"} className="-mt-2 btn btn-link p-0" state={{from}}>
            {" "}
            Register
          </Link>{" "}
        </p>
      </form>
      <SocialLogIn></SocialLogIn>
    </div>
  );
};

export default LogIn;
