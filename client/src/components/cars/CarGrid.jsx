import { AnimatePresence } from 'framer-motion';
import CarCard from './CarCard';
import { CarGridSkeleton } from '@components/ui/Skeleton';
import { SearchX } from 'lucide-react';

export default function CarGrid({ cars, isLoading, error }) {
  if (isLoading) return <CarGridSkeleton />;

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 text-sm">
        Failed to load cars: {error}
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="text-center py-20">
        <SearchX className="mx-auto text-gray-300 dark:text-gray-700" size={40} />
        <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          No cars match your filters.
        </p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting or clearing your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <AnimatePresence mode="popLayout">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </AnimatePresence>
    </div>
  );
}