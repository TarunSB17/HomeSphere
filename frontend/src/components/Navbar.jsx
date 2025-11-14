import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import { Home, PlusCircle, LogOut, User, LogIn, Heart, BarChart3, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-glass sticky top-0 z-50 border-b border-white/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/home" : "/login"} className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center"
            >
              <Home className="text-white w-6 h-6" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              HomeSpere
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {user && (
              <>
                {/* Main nav simplified for sellers */}
                <Link
                  to="/home"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/properties"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Properties
                </Link>
              </>
            )}

            {user ? (
              <>
                {user.role === 'admin' || user.role === 'seller' ? (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/my-properties"
                        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Properties</span>
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/add-property"
                        className="flex items-center space-x-1 bg-gradient-primary text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg font-medium transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Property</span>
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/favorites"
                      className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>My Favorites</span>
                    </Link>
                  </motion.div>
                )}

                {/* Dark Mode Toggle */}
                <DarkModeToggle />

                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                {/* Dark Mode Toggle for non-authenticated users */}
                <DarkModeToggle />
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-primary text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg font-medium transition-all"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 dark:border-gray-800/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {user && (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/home" onClick={() => setMobileOpen(false)} className="btn-ghost">Home</Link>
                <Link to="/properties" onClick={() => setMobileOpen(false)} className="btn-ghost">Properties</Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="btn-ghost">About</Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="btn-ghost">Contact</Link>
              </div>
            )}

            {user ? (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {user.role === 'admin' || user.role === 'seller' ? (
                  <>
                    <Link to="/my-properties" onClick={() => setMobileOpen(false)} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      <User className="w-4 h-4 mr-2" /> My Properties
                    </Link>
                    <Link to="/add-property" onClick={() => setMobileOpen(false)} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-primary text-white">
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Property
                    </Link>
                  </>
                ) : (
                  <Link to="/favorites" onClick={() => setMobileOpen(false)} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    <Heart className="w-4 h-4 mr-2" /> My Favorites
                  </Link>
                )}

                <div className="flex items-center justify-between mt-2">
                  <DarkModeToggle />
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <DarkModeToggle />
                </div>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  <LogIn className="w-4 h-4 mr-2" /> Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-primary text-white">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

