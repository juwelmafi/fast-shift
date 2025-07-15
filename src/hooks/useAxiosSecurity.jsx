import React, { useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { getIdToken } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000", // Consider using VITE_API_BASE_URL for production
});

const useAxiosSecurity = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        try {
          const token = await getIdToken(user, true); // force refresh
          config.headers.Authorization = `Bearer ${token}`;
        } catch (err) {
          console.error("Error fetching token:", err);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;
        console.log("Inside response interceptor:", status);

        if (status === 403) {
          navigate("/forbidden-access");
        } else if (status === 401) {
          logOut()
            .then(() => {
              navigate("/login");
            })
            .catch(() => {});
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecurity;
