import React, { type ReactNode } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  return (
    <div className='min-h-screen bg-bgTwo flex flex-col'>
      <nav className='flex items-center bg-bgFive p-4 justify-end md:text-lg border-b-black border-b-[1px] fixed top-0 z-50 w-full text-white'>
        <div className='flex items-center gap-3 md:gap-5 lg:gap-7 capitalize'>
          <NavLink to={'/'}>Home</NavLink>
          <NavLink to={'/all-videos'}>All Videos</NavLink>
          {token? (
            <NavLink to={'/user/dashboard'}>Dashboard</NavLink>
          ) : (
            <NavLink to={'/sign-in'}>Sign In</NavLink>
          )}
        </div>
      </nav>
    <main className='flex-1 flex flex-col items-center w-full mt-16'>
      { children }
    </main>
    <footer className='bg-black text-center py-6 border-t-[1px] border-t-black z-50'>
      <div className= 'flex justify-center gap-6 mb-4 text-white'>
        <a href= "https://github.com/wa-afk" target= "_blank" rel= "noopener noreferrer" aria-label= "GitHub">
          <FaGithub size={24} />
        </a>
         <a href= "" target= "_blank" rel= "noopener noreferrer" aria-label= "LinkedIn">
          <FaLinkedin size={24} />
        </a>
      </div>
      <p className='text-sm text-gray-400 mb-2'>
        Connecting the world, one video at a time
      </p>
      <p className='text-sm text-gray-400'>
        Copyright © 2026 My Video Hub. All rights reserved.
      </p>
    </footer>
    </div>
  );
};

export default Layout;