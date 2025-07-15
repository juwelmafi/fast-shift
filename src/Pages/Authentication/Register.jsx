import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogIn from "./SocialLogin/SocialLogIn";
import { FaArrowUp, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();
  const { createUser, updateUserPrfile } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const onSubmit = (data) => {
    console.log(data);
    createUser(data?.email, data?.password)
      .then(async (result) => {
        console.log(result.user);

        //update user info in database

        const userInfo = {
          email: data.email,
          role: "user", //detault role
          created_at: new Date().toISOString(),
          last_logged_in: new Date().toISOString(),
        };

        const userRes = await axiosPublic.post("/users", userInfo);
        console.log(userRes.data);

        //update user profile in firebase

        const updatedData = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserPrfile(updatedData)
          .then(() => {
            console.log("name and image updated");
          })
          .catch((error) => {
            console.log(error);
          });

        navigate(from);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setImagePreview(imageUrl);
    }
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMAGE_API_KEY
    }`;

    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="font-bold text-3xl py-5">Create an account!</h2>
        <fieldset className="fieldset">
          {/* image field  */}
          <div className="flex flex-col items-start gap-2">
            <label className="label font-medium">Your Profile Picture</label>

            <div className="relative w-24 h-24">
              {/* Image or Icon Preview */}
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-6xl">
                  <FaUserCircle />
                </div>
              )}

              {/* Upload icon overlay */}
              <label className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <FaArrowUp className="text-green-400 text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* name field  */}
          <label className="label">Your name</label>
          <input
            type="name"
            className="input"
            {...register("name", { required: true })}
            placeholder="Your name"
          />
          {errors.name?.type === "required" && (
            <p className="text-red-500">Name required</p>
          )}

          {/* email field  */}
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            {...register("email", { required: true })}
            placeholder="Email"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-500">Email required</p>
          )}

          {/* password field */}
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            {...register("password", { required: true, minLength: 6 })}
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">Password required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">
              Password must be at least 6 charecter
            </p>
          )}
        </fieldset>
        <button className="btn btn-primary text-black w-[20rem] mt-4">
          Register
        </button>
        <p className="mt-2">
          Already have an account?{" "}
          <Link to={"/login"} className="-mt-2 btn btn-link p-0">
            {" "}
            Login
          </Link>{" "}
        </p>
      </form>
      <SocialLogIn></SocialLogIn>
    </div>
  );
};

export default Register;
