import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import Loading from '../Pages/shared/Loading/Loading';

const PrivateRoute = ({children}) => {
  const {user, loading} = useAuth();
  const location = useLocation();
  const from = location.pathname;

  if(loading){
    return <Loading></Loading>
  }

  if(!user){
   return <Navigate to={'/login'} state={{from: location.pathname}}></Navigate>
  }
  return children;
};

export default PrivateRoute;