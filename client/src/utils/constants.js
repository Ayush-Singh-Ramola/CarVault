export const FUEL_TYPES = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'PLUG_IN_HYBRID', label: 'Plug-in Hybrid' },
  { value: 'CNG', label: 'CNG' },
];

export const TRANSMISSIONS = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'SEMI_AUTOMATIC', label: 'Semi-Automatic' },
  { value: 'CVT', label: 'CVT' },
];

export const BODY_TYPES = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'HATCHBACK', label: 'Hatchback' },
  { value: 'COUPE', label: 'Coupe' },
  { value: 'CONVERTIBLE', label: 'Convertible' },
  { value: 'WAGON', label: 'Wagon' },
  { value: 'PICKUP_TRUCK', label: 'Pickup Truck' },
  { value: 'MINIVAN', label: 'Minivan' },
  { value: 'CROSSOVER', label: 'Crossover' },
];

export const DRIVE_TYPES = [
  { value: 'FWD', label: 'Front-Wheel Drive' },
  { value: 'RWD', label: 'Rear-Wheel Drive' },
  { value: 'AWD', label: 'All-Wheel Drive' },
  { value: 'FOUR_WD', label: '4-Wheel Drive' },
];

export const CAR_STATUSES = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'DRAFT', label: 'Draft' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'mileage_asc', label: 'Mileage: Low to High' },
  { value: 'mileage_desc', label: 'Mileage: High to Low' },
];

export const labelFor = (options, value) => options.find((o) => o.value === value)?.label || value;