import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Car, Sun, Moon, Menu, X, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@context/ThemeContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? 'text-primary-600 dark:text-primary-400'
      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/20 dark:border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-md">
            <Car size={18} />
          </span>
          <span className="text-lg font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            CarVault
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/cars" className={navLinkClass}>
            Browse Cars
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            Compare
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className={navLinkClass}>
              Favorites
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="grid place-items-center h-9 w-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <span className="grid place-items-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-2">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary !px-4 !py-2">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Get started
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 dark:border-white/10 px-4 py-4 space-y-3">
          <NavLink to="/cars" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            <span className="block py-1.5">Browse Cars</span>
          </NavLink>
          <NavLink to="/compare" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            <span className="block py-1.5">Compare</span>
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/favorites"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <span className="flex items-center gap-2 py-1.5">
                <Heart size={16} /> Favorites
              </span>
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <span className="flex items-center gap-2 py-1.5">
                <LayoutDashboard size={16} /> Admin
              </span>
            </NavLink>
          )}

          <div className="pt-3 border-t border-white/20 dark:border-white/10 flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
            </button>
          </div>

          {isAuthenticated ? (
            <div className="space-y-2 pt-1">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <User size={16} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-500"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary flex-1 !py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="btn-primary flex-1 !py-2"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}