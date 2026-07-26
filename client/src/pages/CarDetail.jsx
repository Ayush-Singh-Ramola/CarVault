import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gauge,
  Fuel,
  Settings2,
  Users,
  ShieldCheck,
  Zap,
  Car as CarIcon,
  ArrowLeft,
} from 'lucide-react';
import { carService } from '@services/carService';
import { formatCurrency, formatMileage, formatNumber, resolveImageUrl } from '@utils/formatters';
import { labelFor, FUEL_TYPES, TRANSMISSIONS, BODY_TYPES, DRIVE_TYPES } from '@utils/constants';
import { CarGridSkeleton } from '@components/ui/Skeleton';
import FavoriteButton from '@components/ui/FavoriteButton';
import ReviewsSection from '@components/cars/ReviewsSection';

function SpecRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export default function CarDetail() {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    carService
      .getCarBySlug(slug)
      .then((res) => {
        if (!cancelled) {
          setCar(res.data.car);
          setActiveImage(0);
        }
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <CarGridSkeleton count={1} />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500">{error || 'Car not found'}</p>
        <Link to="/cars" className="btn-primary !w-auto mt-4 px-6 inline-flex">
          Back to listings
        </Link>
      </div>
    );
  }

  const spec = car.specifications || {};
  const images = car.images?.length ? car.images : [{ url: null }];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/cars"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft size={15} /> Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-xl2 overflow-hidden bg-gray-100 dark:bg-gray-800 h-80 sm:h-96">
            <img
              src={resolveImageUrl(images[activeImage]?.url)}
              alt={car.title}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id || i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={resolveImageUrl(img.url)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-medium text-primary-600">{car.brand?.name}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {car.title}
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(car.price)}
            </p>
            <FavoriteButton
              carId={car.id}
              initialFavorited={car.isFavorited}
              size={20}
              className="h-10 w-10 border border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <QuickStat icon={<CarIcon size={16} />} label="Year" value={car.year} />
            <QuickStat icon={<Gauge size={16} />} label="Mileage" value={formatMileage(car.mileage)} />
            <QuickStat icon={<Fuel size={16} />} label="Fuel" value={labelFor(FUEL_TYPES, car.fuelType)} />
            <QuickStat
              icon={<Settings2 size={16} />}
              label="Transmission"
              value={labelFor(TRANSMISSIONS, car.transmission)}
            />
          </div>

          {car.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {car.description}
              </p>
            </div>
          )}

          {spec.features?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {spec.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-10 card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap size={16} className="text-primary-600" /> Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          <div>
            <SpecRow label="Body type" value={labelFor(BODY_TYPES, car.bodyType)} />
            <SpecRow label="Color" value={car.color} />
            <SpecRow label="Engine" value={spec.engine} />
            <SpecRow label="Horsepower" value={spec.horsepower && `${spec.horsepower} hp`} />
          </div>
          <div>
            <SpecRow label="Torque" value={spec.torqueNm && `${spec.torqueNm} Nm`} />
            <SpecRow label="Drivetrain" value={spec.drivetrain && labelFor(DRIVE_TYPES, spec.drivetrain)} />
            <SpecRow
              label="Seating capacity"
              value={spec.seatingCapacity && `${spec.seatingCapacity} seats`}
            />
            <SpecRow label="Doors" value={spec.doors} />
          </div>
          <div>
            <SpecRow
              label="Safety rating"
              value={spec.safetyRating && `${spec.safetyRating} / 5`}
            />
            <SpecRow
              label="0–60 mph"
              value={spec.acceleration0to60 && `${spec.acceleration0to60}s`}
            />
            <SpecRow label="Top speed" value={spec.topSpeedKmh && `${spec.topSpeedKmh} km/h`} />
            <SpecRow label="Weight" value={spec.weightKg && `${formatNumber(spec.weightKg)} kg`} />
          </div>
        </div>
      </div>

      {(car.reviewCount > 0 || car.avgRating > 0) && (
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <ShieldCheck size={16} className="text-primary-600" />
          {car.avgRating.toFixed(1)} average rating from {car.reviewCount} review
          {car.reviewCount !== 1 ? 's' : ''}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Users size={16} /> Listed by {car.createdBy?.name || 'CarVault'}
      </div>

      <ReviewsSection carId={car.id} />
    </div>
  );
}

function QuickStat({ icon, label, value }) {
  return (
    <div className="card p-3 text-center">
      <div className="flex items-center justify-center text-primary-600 mb-1">{icon}</div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
  );
}