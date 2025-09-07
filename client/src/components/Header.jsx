import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();

  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  } catch (err) {
    userInfo = null;
  }

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md text-slate-800 w-full shadow-sm fixed top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-xl font-bold text-slate-700">TaskManager</span>
            </Link>
          </div>

          {/* Desktop nav (md and up) */}
          <nav className="hidden md:block">
            {userInfo ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <UserCircleIcon className="h-6 w-6 text-slate-500" />
                    <span className="font-semibold text-slate-600">Hi, {userInfo.name}</span>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          className={`${active ? 'bg-slate-100' : ''} px-4 py-2 text-sm text-slate-700`}
                        >
                          <div className="font-medium">{userInfo.name}</div>
                          {userInfo.email && <div className="text-xs text-slate-500 truncate">{userInfo.email}</div>}
                        </div>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logoutHandler}
                          className={`${active ? 'bg-slate-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-slate-700`}
                        >
                          {/* red logout icon with hover intensification */}
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile profile (visible on small screens) */}
          <div className="md:hidden flex items-center">
            {userInfo ? (
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <UserCircleIcon className="h-7 w-7 text-slate-500" />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-2 top-14 mt-2 w-44 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <Menu.Item>
                      {({ active }) => (
                        <div className={`${active ? 'bg-slate-100' : ''} px-4 py-2 text-sm text-slate-700`}>
                          <div className="font-medium">{userInfo.name}</div>
                          {userInfo.email && <div className="text-xs text-slate-500 truncate">{userInfo.email}</div>}
                        </div>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logoutHandler}
                          className={`${active ? 'bg-slate-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-slate-700`}
                        >
                          {/* red logout icon with hover intensification */}
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
