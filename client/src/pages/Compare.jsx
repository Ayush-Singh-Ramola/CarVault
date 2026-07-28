import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, Search, GitCompare } from 'lucide-react';
import { carService } from '@services/carService';
import { formatCurrency, formatMileage, resolveImageUrl } from '@utils/formatters';
import { labelFor, FUEL_TYPES, TRANSMISSIONS } from '@utils/constants';
import { useDebounce } from '@hooks/useDebounce';

const MAX_COMPARE = 3;

function SpecRow({ label, values }) {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-3 pr-4 text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="py-3 px-4 text-sm text-gray-900 dark:text-white text-center">
          {v ?? '—'}
        </td>
      ))}
    </tr>
  );
}

function CarPickerSlot({ onSelect, disabledIds }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    carService
      .getCars({ search: debouncedQuery, limit: 6, sortBy: 'newest' })
      .then((res) => {
        if (!cancelled) setResults(res.data.cars.filter((c) => !disabledIds.includes(c.id)));
      })
      .catch(() => !cancelled && setResults([]));
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, disabledIds]);

  return (
    <div className="card relative flex flex-col items-center justify-center h-full min-h-[220px] p-6 border-2 border-dashed border-gray-200 dark:border-gray-700">
      <GitCompare size={22} className="text-gray-300 dark:text-gray-600 mb-2" />
      <div className="relative w-full max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search a car to add…"
          className="input-field !pl-8 text-sm"
        />

        {isOpen && results.length > 0 && (
          <div className="absolute z-10 top-full mt-1 w-full card p-1.5 max-h-64 overflow-y-auto">
            {results.map((car) => (
              <button
                key={car.id}
                onClick={() => {
                  onSelect(car.id);
                  setQuery('');
                  setResults([]);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <img
                  src={resolveImageUrl(car.images?.[0]?.url)}
                  alt=""
                  className="h-9 w-12 rounded object-cover bg-gray-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {car.title}
                  </p>
                  <p className="text-xs text-gray-400">{formatCurrency(car.price)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ids = (searchParams.get('ids') || '').split(',').filter(Boolean).slice(0, MAX_COMPARE);

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCars = useCallback(async () => {
    if (!ids.length) {
      setCars([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await Promise.all(
        ids.map((id) => carService.getCarBySlug(id).then((res) => res.data.car))
      );
      setCars(results);
    } catch {
      // if one lookup fails (e.g. deleted car), just drop it silently
      setCars((prev) => prev.filter(Boolean));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const addCar = (carId) => {
    const next = [...ids, carId].slice(0, MAX_COMPARE);
    setSearchParams({ ids: next.join(',') });
  };

  const removeCar = (carId) => {
    const next = ids.filter((id) => id !== carId);
    if (next.length) {
      setSearchParams({ ids: next.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const slotsToFill = MAX_COMPARE - cars.length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Cars</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add up to {MAX_COMPARE} cars to compare side by side
        </p>
      </div>

      {/* Car cards + picker slots */}
      <div
        className="grid gap-4 mb-8"
        style={{ gridTemplateColumns: `repeat(${MAX_COMPARE}, minmax(0, 1fr))` }}
      >
        {cars.map((car) => (
          <div key={car.id} className="card overflow-hidden relative">
            <button
              onClick={() => removeCar(car.id)}
              className="absolute top-2 right-2 z-10 h-7 w-7 grid place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Remove from comparison"
            >
              <X size={14} />
            </button>
            <Link to={`/cars/${car.slug}`}>
              <img
                src={resolveImageUrl(car.images?.[0]?.url)}
                alt={car.title}
                className="h-32 w-full object-cover bg-gray-100 dark:bg-gray-800"
              />
              <div className="p-3">
                <p className="text-xs text-primary-600 font-medium">{car.brand?.name}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {car.title}
                </p>
              </div>
            </Link>
          </div>
        ))}

        {Array.from({ length: slotsToFill }).map((_, i) => (
          <CarPickerSlot
            key={i}
            onSelect={addCar}
            disabledIds={ids}
          />
        ))}
      </div>

      {/* Comparison table */}
      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-12">Loading comparison…</p>
      ) : cars.length < 2 ? (
        <div className="text-center py-16">
          <GitCompare className="mx-auto text-gray-300 dark:text-gray-700" size={36} />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Add at least 2 cars above to see a side-by-side comparison.
          </p>
        </div>
      ) : (
        <div className="card overflow-x-auto p-6">
          <table className="w-full">
            <tbody>
              <SpecRow label="Price" values={cars.map((c) => formatCurrency(c.price))} />
              <SpecRow label="Mileage" values={cars.map((c) => formatMileage(c.mileage))} />
              <SpecRow
                label="Horsepower"
                values={cars.map((c) =>
                  c.specifications?.horsepower ? `${c.specifications.horsepower} hp` : null
                )}
              />
              <SpecRow
                label="Fuel Type"
                values={cars.map((c) => labelFor(FUEL_TYPES, c.fuelType))}
              />
              <SpecRow label="Engine" values={cars.map((c) => c.specifications?.engine)} />
              <SpecRow
                label="Transmission"
                values={cars.map((c) => labelFor(TRANSMISSIONS, c.transmission))}
              />
              <SpecRow
                label="Seating Capacity"
                values={cars.map((c) =>
                  c.specifications?.seatingCapacity
                    ? `${c.specifications.seatingCapacity} seats`
                    : null
                )}
              />
              <SpecRow
                label="Safety Rating"
                values={cars.map((c) =>
                  c.specifications?.safetyRating ? `${c.specifications.safetyRating} / 5` : null
                )}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}