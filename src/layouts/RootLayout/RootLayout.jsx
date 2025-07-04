import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../Pages/shared/Navbar/Navbar';
import Footer from '../../Pages/shared/Footer/Footer';

const RootLayout = () => {
  return (
    <div className='bg'>
      <Navbar></Navbar>
      <div className='max-w-7xl mx-auto min-h-[calc(100vh-330.33px)]'>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;