import { X } from 'lucide-react';
import { useBrands } from '@hooks/useBrands';
import { FUEL_TYPES, TRANSMISSIONS, BODY_TYPES } from '@utils/constants';

const CURRENT_YEAR = new Date().getFullYear();

export default function CarFilters({ filters, onChange, onClear, isOpen, onClose }) {
  const { brands } = useBrands();

  const toggleArrayValue = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const setRange = (key, bound, value) => {
    onChange({ ...filters, [`${bound}${key}`]: value === '' ? undefined : Number(value) });
  };

  const activeCount =
    (filters.brandId?.length || 0) +
    (filters.fuelType?.length || 0) +
    (filters.transmission?.length || 0) +
    (filters.bodyType?.length || 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.minYear ? 1 : 0) +
    (filters.maxYear ? 1 : 0);

  return (
    <aside
      className={`fixed inset-0 z-50 lg:static lg:z-auto lg:block ${isOpen ? 'block' : 'hidden'}`}
    >
      <div
        className="absolute inset-0 bg-black/40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white dark:bg-gray-900 p-5 lg:static lg:h-auto lg:w-full lg:max-w-none lg:bg-transparent lg:dark:bg-transparent lg:p-0 card lg:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Filters {activeCount > 0 && <span className="text-primary-600">({activeCount})</span>}
          </h2>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button onClick={onClear} className="text-xs font-medium text-primary-600">
                Clear all
              </button>
            )}
            <button onClick={onClose} className="lg:hidden text-gray-400">
              <X size={18} />
            </button>
          </div>
        </div>

        <FilterSection title="Brand">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <Checkbox
                key={brand.id}
                label={`${brand.name} (${brand._count?.cars ?? 0})`}
                checked={(filters.brandId || []).includes(brand.id)}
                onChange={() => toggleArrayValue('brandId', brand.id)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ''}
              onChange={(e) => setRange('Price', 'min', e.target.value)}
              className="input-field !py-2 text-sm"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice ?? ''}
              onChange={(e) => setRange('Price', 'max', e.target.value)}
              className="input-field !py-2 text-sm"
            />
          </div>
        </FilterSection>

        <FilterSection title="Year">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="From"
              min={1980}
              max={CURRENT_YEAR + 1}
              value={filters.minYear ?? ''}
              onChange={(e) => setRange('Year', 'min', e.target.value)}
              className="input-field !py-2 text-sm"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              placeholder="To"
              min={1980}
              max={CURRENT_YEAR + 1}
              value={filters.maxYear ?? ''}
              onChange={(e) => setRange('Year', 'max', e.target.value)}
              className="input-field !py-2 text-sm"
            />
          </div>
        </FilterSection>

        <FilterSection title="Fuel type">
          <div className="space-y-2">
            {FUEL_TYPES.map((opt) => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                checked={(filters.fuelType || []).includes(opt.value)}
                onChange={() => toggleArrayValue('fuelType', opt.value)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Transmission">
          <div className="space-y-2">
            {TRANSMISSIONS.map((opt) => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                checked={(filters.transmission || []).includes(opt.value)}
                onChange={() => toggleArrayValue('transmission', opt.value)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Body type" last>
          <div className="space-y-2">
            {BODY_TYPES.map((opt) => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                checked={(filters.bodyType || []).includes(opt.value)}
                onChange={() => toggleArrayValue('bodyType', opt.value)}
              />
            ))}
          </div>
        </FilterSection>

        <button onClick={onClose} className="btn-primary w-full mt-2 lg:hidden">
          Show results
        </button>
      </div>
    </aside>
  );
}

function FilterSection({ title, children, last }) {
  return (
    <div className={`py-4 ${!last ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-600 dark:text-gray-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500/30"
      />
      {label}
    </label>
  );
}