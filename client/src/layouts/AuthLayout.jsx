import { motion } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-400/10 dark:from-surface-dark dark:via-gray-950 dark:to-surface-dark px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-md">
            <Car size={20} />
          </span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            CarVault
          </span>
        </Link>

        <div className="glass rounded-xl2 p-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}