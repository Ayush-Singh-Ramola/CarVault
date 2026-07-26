import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function StatCard({ icon, label, value, accent = 'primary', subtext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtext && <p className="mt-1 text-xs text-gray-400">{subtext}</p>}
        </div>
        <span
          className={clsx(
            'grid place-items-center h-10 w-10 rounded-xl',
            accent === 'primary' && 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
            accent === 'accent' && 'bg-accent-500/10 text-accent-500',
            accent === 'green' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            accent === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
          )}
        >
          {icon}
        </span>
      </div>
    </motion.div>
  );
}