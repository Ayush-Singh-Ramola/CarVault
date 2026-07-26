import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BRANDS = [
  { name: 'Toyota', country: 'Japan' },
  { name: 'Honda', country: 'Japan' },
  { name: 'BMW', country: 'Germany' },
  { name: 'Mercedes-Benz', country: 'Germany' },
  { name: 'Tesla', country: 'USA' },
  { name: 'Ford', country: 'USA' },
  { name: 'Hyundai', country: 'South Korea' },
  { name: 'Audi', country: 'Germany' },
];

const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUG_IN_HYBRID'];
const TRANSMISSIONS = ['MANUAL', 'AUTOMATIC', 'CVT'];
const BODY_TYPES = ['SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CROSSOVER', 'PICKUP_TRUCK'];
const DRIVE_TYPES = ['FWD', 'RWD', 'AWD'];
const COLORS = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Gray'];

const MODELS_BY_BRAND = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  Ford: ['F-150', 'Mustang', 'Explorer', 'Escape'],
  Hyundai: ['Elantra', 'Tucson', 'Santa Fe', 'Sonata'],
  Audi: ['A4', 'A6', 'Q5', 'Q7'],
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('🌱 Seeding CarVault database...');

  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.image.deleteMany();
  await prisma.specifications.deleteMany();
  await prisma.car.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const userPassword = await bcrypt.hash('User@123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@carvault.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Jordan Smith',
      email: 'user@carvault.com',
      password: userPassword,
      role: 'USER',
    },
  });

  const otherUsers = await Promise.all(
    ['Alex Chen', 'Priya Patel', 'Sam Rivera'].map((name) =>
      prisma.user.create({
        data: {
          name,
          email: `${slugify(name)}@example.com`,
          password: userPassword,
          role: 'USER',
        },
      })
    )
  );

  const allUsers = [demoUser, ...otherUsers];
  console.log(`✅ Created ${allUsers.length + 1} users (1 admin, ${allUsers.length} regular)`);

  const brands = await Promise.all(
    BRANDS.map((b) =>
      prisma.brand.create({
        data: {
          name: b.name,
          country: b.country,
          logoUrl: `https://placehold.co/120x60?text=${encodeURIComponent(b.name)}`,
        },
      })
    )
  );
  console.log(`✅ Created ${brands.length} brands`);

  let carCount = 0;

  for (const brand of brands) {
    const models = MODELS_BY_BRAND[brand.name] || ['Base Model'];

    for (const model of models) {
      const year = randomInt(2019, 2026);
      const fuelType = brand.name === 'Tesla' ? 'ELECTRIC' : randomFrom(FUEL_TYPES);
      const transmission = fuelType === 'ELECTRIC' ? 'AUTOMATIC' : randomFrom(TRANSMISSIONS);
      const bodyType = randomFrom(BODY_TYPES);
      const basePrice = randomInt(18000, 95000);
      const mileage = fuelType === 'ELECTRIC' ? randomInt(0, 40000) : randomInt(0, 120000);
      const monthsAgo = randomInt(0, 18);
      const createdAt = new Date();
      createdAt.setMonth(createdAt.getMonth() - monthsAgo);

      const title = `${year} ${brand.name} ${model}`;
      const slug = `${slugify(title)}-${randomInt(1000, 9999)}`;

      const car = await prisma.car.create({
        data: {
          title,
          slug,
          model,
          year,
          price: basePrice,
          mileage,
          color: randomFrom(COLORS),
          description: `A well-maintained ${year} ${brand.name} ${model} in excellent condition. Regularly serviced with a clean history.`,
          fuelType,
          transmission,
          bodyType,
          status: 'AVAILABLE',
          isFeatured: Math.random() < 0.15,
          createdAt,
          brand: { connect: { id: brand.id } },
          createdBy: { connect: { id: admin.id } },
          specifications: {
            create: {
              engine: fuelType === 'ELECTRIC' ? 'Dual Electric Motor' : `${(Math.random() * 2 + 1.5).toFixed(1)}L Turbo`,
              horsepower: randomInt(120, 500),
              torqueNm: randomInt(150, 650),
              drivetrain: randomFrom(DRIVE_TYPES),
              seatingCapacity: randomFrom([2, 4, 5, 7]),
              doors: randomFrom([2, 4]),
              safetyRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
              acceleration0to60: parseFloat((Math.random() * 6 + 3).toFixed(1)),
              topSpeedKmh: randomInt(180, 300),
              fuelTankCapacityL: fuelType === 'ELECTRIC' ? null : parseFloat(randomInt(40, 80).toFixed(1)),
              fuelEconomyKmpl: fuelType === 'ELECTRIC' ? null : parseFloat((Math.random() * 10 + 8).toFixed(1)),
              weightKg: randomInt(1200, 2400),
              features: [
                'Bluetooth Connectivity',
                'Backup Camera',
                'Cruise Control',
                ...(Math.random() > 0.5 ? ['Sunroof'] : []),
                ...(Math.random() > 0.5 ? ['Leather Seats'] : []),
                ...(Math.random() > 0.6 ? ['Adaptive Cruise Control'] : []),
                ...(Math.random() > 0.7 ? ['Apple CarPlay / Android Auto'] : []),
              ],
            },
          },
          images: {
            create: [0, 1, 2].map((i) => ({
              url: `https://placehold.co/800x500?text=${encodeURIComponent(model)}+${i + 1}`,
              isPrimary: i === 0,
              order: i,
            })),
          },
        },
      });

      for (const user of allUsers) {
        if (Math.random() < 0.25) {
          await prisma.favorite.create({
            data: { userId: user.id, carId: car.id },
          });
        }
        if (Math.random() < 0.3) {
          await prisma.review.create({
            data: {
              userId: user.id,
              carId: car.id,
              rating: randomInt(3, 5),
              comment: randomFrom([
                'Great condition, exactly as described.',
                'Smooth ride and responsive dealer communication.',
                'Good value for the price.',
                'Minor wear but overall solid purchase.',
                'Would recommend to anyone looking in this segment.',
              ]),
            },
          });
        }
      }

      const agg = await prisma.review.aggregate({
        where: { carId: car.id },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.car.update({
        where: { id: car.id },
        data: {
          avgRating: agg._avg.rating || 0,
          reviewCount: agg._count.rating,
        },
      });

      carCount += 1;
    }
  }

  console.log(`✅ Created ${carCount} cars with specifications and images`);
  console.log('🌱 Seeding complete!');
  console.log('\nDemo credentials:');
  console.log('  Admin: admin@carvault.com / Admin@123');
  console.log('  User:  user@carvault.com / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });