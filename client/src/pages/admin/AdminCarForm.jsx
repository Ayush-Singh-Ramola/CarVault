import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { X, Upload, ArrowLeft } from 'lucide-react';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import FormTextarea from '@components/ui/FormTextarea';
import Button from '@components/ui/Button';
import { carService } from '@services/carService';
import { useBrands } from '@hooks/useBrands';
import { carFormSchema } from '@utils/validationSchemas';
import { resolveImageUrl } from '@utils/formatters';
import {
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
  DRIVE_TYPES,
  CAR_STATUSES,
} from '@utils/constants';

export default function AdminCarForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { brands } = useBrands();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCar, setIsLoadingCar] = useState(isEditMode);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: { status: 'AVAILABLE', isFeatured: false },
  });

  useEffect(() => {
    if (!isEditMode) return;
    let cancelled = false;
    carService
      .getCarBySlug(id)
      .then((res) => {
        if (cancelled) return;
        const car = res.data.car;
        const spec = car.specifications || {};
        reset({
          title: car.title,
          model: car.model,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          color: car.color || '',
          description: car.description || '',
          fuelType: car.fuelType,
          transmission: car.transmission,
          bodyType: car.bodyType,
          brandId: car.brandId,
          status: car.status,
          isFeatured: car.isFeatured,
          engine: spec.engine || '',
          horsepower: spec.horsepower ?? '',
          torqueNm: spec.torqueNm ?? '',
          drivetrain: spec.drivetrain || '',
          seatingCapacity: spec.seatingCapacity ?? '',
          doors: spec.doors ?? '',
          safetyRating: spec.safetyRating ?? '',
          acceleration0to60: spec.acceleration0to60 ?? '',
          topSpeedKmh: spec.topSpeedKmh ?? '',
          fuelTankCapacityL: spec.fuelTankCapacityL ?? '',
          fuelEconomyKmpl: spec.fuelEconomyKmpl ?? '',
          weightKg: spec.weightKg ?? '',
          features: (spec.features || []).join(', '),
        });
        setExistingImages(car.images || []);
      })
      .catch((err) => toast.error(err.message || 'Failed to load car'))
      .finally(() => !cancelled && setIsLoadingCar(false));
    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, reset]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (image) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      await carService.deleteCarImage(id, image.id);
      setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
      toast.success('Image removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove image');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        formData.append(key, value);
      });
      newImageFiles.forEach((file) => formData.append('images', file));

      if (isEditMode) {
        await carService.updateCar(id, formData);
        toast.success('Car updated successfully');
      } else {
        await carService.createCar(formData);
        toast.success('Car created successfully');
      }
      navigate('/admin/cars');
    } catch (err) {
      toast.error(err.message || 'Failed to save car');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCar) {
    return <div className="p-8 text-center text-gray-400">Loading car…</div>;
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <button
        onClick={() => navigate('/admin/cars')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft size={15} /> Back to cars
      </button>

      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditMode ? 'Edit Car' : 'Add New Car'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Title"
              placeholder="2024 Toyota Camry SE"
              error={errors.title}
              {...register('title')}
            />
            <FormInput label="Model" error={errors.model} {...register('model')} />
            <FormSelect label="Brand" error={errors.brandId} {...register('brandId')}>
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </FormSelect>
            <FormInput label="Year" type="number" error={errors.year} {...register('year')} />
            <FormInput
              label="Price (USD)"
              type="number"
              error={errors.price}
              {...register('price')}
            />
            <FormInput
              label="Mileage"
              type="number"
              error={errors.mileage}
              {...register('mileage')}
            />
            <FormInput label="Color" error={errors.color} {...register('color')} />
            <FormSelect label="Status" {...register('status')}>
              {CAR_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </FormSelect>
            <FormSelect label="Fuel type" error={errors.fuelType} {...register('fuelType')}>
              <option value="">Select fuel type</option>
              {FUEL_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              label="Transmission"
              error={errors.transmission}
              {...register('transmission')}
            >
              <option value="">Select transmission</option>
              {TRANSMISSIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FormSelect>
            <FormSelect label="Body type" error={errors.bodyType} {...register('bodyType')}>
              <option value="">Select body type</option>
              {BODY_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FormSelect>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
              <input type="checkbox" className="h-4 w-4 rounded" {...register('isFeatured')} />
              Featured listing
            </label>
          </div>
          <div className="mt-4">
            <FormTextarea
              label="Description"
              error={errors.description}
              {...register('description')}
            />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Specifications <span className="text-xs font-normal text-gray-400">(optional)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput label="Engine" {...register('engine')} />
            <FormInput label="Horsepower" type="number" {...register('horsepower')} />
            <FormInput label="Torque (Nm)" type="number" {...register('torqueNm')} />
            <FormSelect label="Drivetrain" {...register('drivetrain')}>
              <option value="">Select drivetrain</option>
              {DRIVE_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FormSelect>
            <FormInput label="Seating capacity" type="number" {...register('seatingCapacity')} />
            <FormInput label="Doors" type="number" {...register('doors')} />
            <FormInput
              label="Safety rating (0–5)"
              type="number"
              step="0.1"
              {...register('safetyRating')}
            />
            <FormInput
              label="0–60 mph (sec)"
              type="number"
              step="0.1"
              {...register('acceleration0to60')}
            />
            <FormInput label="Top speed (km/h)" type="number" {...register('topSpeedKmh')} />
            <FormInput
              label="Fuel tank (L)"
              type="number"
              {...register('fuelTankCapacityL')}
            />
            <FormInput
              label="Fuel economy (km/l)"
              type="number"
              {...register('fuelEconomyKmpl')}
            />
            <FormInput label="Weight (kg)" type="number" {...register('weightKg')} />
          </div>
          <div className="mt-4">
            <FormInput
              label="Features (comma-separated)"
              placeholder="Sunroof, Leather Seats, Apple CarPlay"
              {...register('features')}
            />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Images</h2>

          {existingImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={resolveImageUrl(img.url)}
                    alt=""
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  {img.isPrimary && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-primary-600 text-white px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-1 right-1 h-6 w-6 grid place-items-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {newImagePreviews.map((src, i) => (
                <div key={src} className="relative group">
                  <img src={src} alt="" className="h-24 w-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 h-6 w-6 grid place-items-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 transition-colors">
            <Upload size={20} className="text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload images (max 10, 5MB each)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" isLoading={isSubmitting} className="!w-auto px-8">
            {isEditMode ? 'Save changes' : 'Create car'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="!w-auto px-6"
            onClick={() => navigate('/admin/cars')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}