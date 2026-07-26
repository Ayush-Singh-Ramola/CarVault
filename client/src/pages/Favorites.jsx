import { useState, useEffect, useCallback } from 'react';
import { HeartOff } from 'lucide-react';
import { favoriteService } from '@services/favoriteService';
import CarCard from '@components/cars/CarCard';
import Pagination from '@components/ui/Pagination';
import { CarGridSkeleton } from '@components/ui/Skeleton';

export default function Favorites() {
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await favoriteService.getFavorites({ page, limit: 12 });
      setCars(res.data.cars);
      setMeta(res.meta);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleUnfavorite = (carId) => {
    setCars((prev) => prev.filter((c) => c.id !== carId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Favorites</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {meta ? `${meta.total} saved cars` : 'Loading…'}
      </p>

      {isLoading ? (
        <CarGridSkeleton />
      ) : cars.length === 0 ? (
        <div className="text-center py-20">
          <HeartOff className="mx-auto text-gray-300 dark:text-gray-700" size={40} />
          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            You haven&apos;t saved any cars yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onFavoriteChange={(isFav) => !isFav && handleUnfavorite(car.id)}
            />
          ))}
        </div>
      )}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}
    </div>
  );
}