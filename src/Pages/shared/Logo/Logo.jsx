import React from 'react';
import logo from "../../../assets/logo.png"
import { Link } from 'react-router';

const Logo = () => {
  return (
    <Link to={'/'}>
      <div className='flex items-end'>
      <img className='w-7 mb-2' src={logo} alt="" />
      <h2 className='text-2xl font-extrabold -ml-2'>FastShift</h2>
    </div>
    </Link>
  );
};

export default Logo;