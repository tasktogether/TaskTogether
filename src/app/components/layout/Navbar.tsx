import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-green-100/50 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#8CC63F] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Heart size={20} className="text-white fill-white md:w-6 md:h-6" />
              </div>
              <span className="font-fredoka text-xl md:text-2xl font-bold text-[#4B4B55]">
                Richmond Senior Center
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium font-poppins transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link to="/opportunities" className="text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium font-poppins transition-colors relative group">
            Opportunities
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link to="/stories" className="text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium font-poppins transition-colors flex items-center gap-1 relative group">
            <span className="text-pink-400">♥</span> Stories
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <div className="w-px h-6 bg-gradient-to-b from-transparent via-green-200 to-transparent dark:via-slate-700" />

          {user ? (
            <div className="flex items-center gap-4">
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {user.name.split(' ')[0]}
                  </span>
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/apply">
                <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300">
                  Apply Now
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-3">
          <button
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
          <div className="p-6 flex flex-col gap-4">
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/opportunities"
              className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Opportunities
            </Link>

            <Link
              to="/stories"
              className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-pink-400">♥</span> Stories of Kindness
            </Link>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                >
                  <Button fullWidth variant="secondary" className="justify-start gap-2">
                    <User size={18} /> {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Button>
                </Link>

                <Button
                  fullWidth
                  variant="ghost"
                  className="justify-start text-red-500 dark:text-red-400"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" fullWidth>Log In</Button>
                </Link>

                <Link to="/apply" onClick={() => setIsOpen(false)}>
                  <Button fullWidth className="bg-green-600 hover:bg-green-700 text-white">
                    Apply Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
