import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Find your next car with{' '}
          <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            CarVault
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {isAuthenticated
            ? `Welcome back, ${user.name.split(' ')[0]}.`
            : 'Browse, search, filter, favorite, and review cars — all in one place.'}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/cars" className="btn-primary !px-6 !py-3">
            Browse cars
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn-secondary !px-6 !py-3">
              Get started
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}