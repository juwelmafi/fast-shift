import React from "react";
import axios from "axios";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecurity = () => {
  const {user} = useAuth();
  axiosSecure.interceptors.request.use(config =>{
    config.headers.Authorization = `Bearer ${user.accessToken}`
    return config;
  }, (error)=>{
    return Promise.reject(error)
  })

  return axiosSecure;
};

export default useAxiosSecurity;
