import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Fuel, Settings2 } from 'lucide-react';
import { formatCurrency, formatMileage, resolveImageUrl } from '@utils/formatters';
import { labelFor, FUEL_TYPES, TRANSMISSIONS } from '@utils/constants';
import FavoriteButton from '@components/ui/FavoriteButton';

export default function CarCard({ car, onFavoriteChange }) {
  const thumbnail = car.images?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="card overflow-hidden group"
    >
      <Link to={`/cars/${car.slug}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={resolveImageUrl(thumbnail)}
            alt={car.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {car.isFeatured && (
            <span className="absolute top-3 left-3 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
              Featured
            </span>
          )}
          {car.status !== 'AVAILABLE' && (
            <span className="absolute top-3 right-3 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-semibold text-white">
              {car.status.charAt(0) + car.status.slice(1).toLowerCase()}
            </span>
          )}
          <FavoriteButton
            carId={car.id}
            initialFavorited={car.isFavorited}
            onChange={onFavoriteChange}
            className="absolute bottom-3 right-3 h-8 w-8 bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-sm"
          />
        </div>

        <div className="p-4">
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
            {car.brand?.name}
          </p>
          <h3 className="mt-0.5 font-semibold text-gray-900 dark:text-white line-clamp-1">
            {car.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Gauge size={13} /> {formatMileage(car.mileage)}
            </span>
            <span className="flex items-center gap-1">
              <Fuel size={13} /> {labelFor(FUEL_TYPES, car.fuelType)}
            </span>
            <span className="flex items-center gap-1">
              <Settings2 size={13} /> {labelFor(TRANSMISSIONS, car.transmission)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(car.price)}
            </span>
            <span className="text-xs text-gray-400">{car.year}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}