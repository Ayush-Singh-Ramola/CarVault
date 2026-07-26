import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import CarFilters from '@components/cars/CarFilters';
import CarGrid from '@components/cars/CarGrid';
import Pagination from '@components/ui/Pagination';
import { useCars } from '@hooks/useCars';
import { useDebounce } from '@hooks/useDebounce';
import { SORT_OPTIONS } from '@utils/constants';

const ARRAY_KEYS = ['brandId', 'fuelType', 'transmission', 'bodyType'];
const NUMBER_KEYS = ['minPrice', 'maxPrice', 'minYear', 'maxYear'];

function parseFiltersFromParams(searchParams) {
  const filters = {};
  for (const key of ARRAY_KEYS) {
    const val = searchParams.get(key);
    if (val) filters[key] = val.split(',');
  }
  for (const key of NUMBER_KEYS) {
    const val = searchParams.get(key);
    if (val) filters[key] = Number(val);
  }
  return filters;
}

export default function CarsListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      sortBy,
      page,
      limit: 12,
    }),
    [filters, debouncedSearch, sortBy, page]
  );

  const { cars, meta, isLoading, error } = useCars(queryParams);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(','));
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next);
  };

  const handleFiltersChange = (newFilters) => {
    updateParams({ ...newFilters, page: undefined });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(debouncedSearch ? { search: debouncedSearch } : {}));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Cars</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {meta ? `${meta.total} cars available` : 'Loading inventory…'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, model, or brand…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              updateParams({ search: e.target.value, page: undefined });
            }}
            className="input-field !pl-10"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => updateParams({ sortBy: e.target.value, page: undefined })}
          className="input-field sm:w-56 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilterPanelOpen(true)}
          className="btn-secondary sm:w-auto lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <CarFilters
          filters={filters}
          onChange={handleFiltersChange}
          onClear={handleClearFilters}
          isOpen={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
        />

        <div>
          <CarGrid cars={cars} isLoading={isLoading} error={error} />
          {meta && (
            <Pagination meta={meta} onPageChange={(p) => updateParams({ page: p })} />
          )}
        </div>
      </div>
    </div>
  );
}