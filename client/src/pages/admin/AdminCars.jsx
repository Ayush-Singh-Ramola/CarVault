import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useCars } from '@hooks/useCars';
import { carService } from '@services/carService';
import { formatCurrency, formatMileage, resolveImageUrl } from '@utils/formatters';
import Pagination from '@components/ui/Pagination';
import { CAR_STATUSES, labelFor } from '@utils/constants';

export default function AdminCars() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const { cars, meta, isLoading, refetch } = useCars({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
    sortBy: 'newest',
  });

  const handleDelete = async (car) => {
    if (!window.confirm(`Delete "${car.title}"? This cannot be undone.`)) return;
    setDeletingId(car.id);
    try {
      await carService.deleteCar(car.id);
      toast.success('Car deleted');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete car');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manage Cars</h1>
          <p className="text-sm text-gray-500">{meta ? `${meta.total} total listings` : ''}</p>
        </div>
        <Link to="/admin/cars/new" className="btn-primary !w-auto px-4">
          <Plus size={16} /> Add new car
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search cars…"
            className="input-field !pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="input-field sm:w-48 cursor-pointer"
        >
          <option value="">All statuses</option>
          {CAR_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-gray-500">
              <th className="p-4 font-medium">Car</th>
              <th className="p-4 font-medium">Brand</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Mileage</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No cars found.
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr
                  key={car.id}
                  className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(car.images?.[0]?.url)}
                        alt=""
                        className="h-10 w-14 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {car.title}
                        </p>
                        <p className="text-xs text-gray-400">{car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{car.brand?.name}</td>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {formatCurrency(car.price)}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {formatMileage(car.mileage)}
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                      {labelFor(CAR_STATUSES, car.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/cars/${car.id}/edit`}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(car)}
                        disabled={deletingId === car.id}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && <Pagination meta={meta} onPageChange={setPage} />}
    </div>
  );
}