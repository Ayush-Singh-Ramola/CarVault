import { Outlet } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-surface-dark">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} CarVault. Built for demonstration purposes.
      </footer>
    </div>
  );
}