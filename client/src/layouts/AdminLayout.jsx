import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutGrid, Car, ArrowLeft } from 'lucide-react';

const linkClass = ({ isActive }) =>
  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary-600 text-white'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`;

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-surface-dark">
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 p-4 hidden md:flex md:flex-col">
        <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-2">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 text-white">
            <Car size={16} />
          </span>
          <span className="font-bold text-gray-900 dark:text-white">CarVault Admin</span>
        </Link>

        <nav className="space-y-1 mt-4 flex-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutGrid size={17} /> Dashboard
          </NavLink>
          <NavLink to="/admin/cars" className={linkClass}>
            <Car size={17} /> Manage Cars
          </NavLink>
        </nav>

        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-500 hover:text-primary-600"
        >
          <ArrowLeft size={16} /> Back to site
        </Link>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}