import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

dotenv.config();

const demoImages = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=800&fit=crop'
];

const demoModels = [
  'https://res.cloudinary.com/demo/raw/upload/sample_3d_model.glb',
  'https://res.cloudinary.com/demo/raw/upload/villa_3d_model.glb',
  'https://res.cloudinary.com/demo/raw/upload/mountain_house_3d.glb'
];

const propertiesSeed = [
  {
    title: 'Modern Downtown Loft',
    description: 'Stunning modern loft with floor-to-ceiling windows and city views.',
    price: 1250000,
    location: 'Manhattan, New York',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    propertyType: 'apartment'
  },
  {
    title: 'Luxury Beachfront Villa',
    description: 'Breathtaking oceanfront estate with panoramic Pacific views.',
    price: 5500000,
    location: 'Malibu, California',
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    propertyType: 'villa'
  },
  {
    title: 'Contemporary Mountain Retreat',
    description: 'Architectural masterpiece nestled in the Rocky Mountains.',
    price: 3200000,
    location: 'Aspen, Colorado',
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    propertyType: 'house'
  },
  {
    title: 'Minimalist City Condo',
    description: 'Bright and airy condo with smart-home features.',
    price: 890000,
    location: 'San Francisco, California',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    propertyType: 'condo'
  },
  {
    title: 'Spacious Family Home',
    description: 'Perfect family home with large backyard and deck.',
    price: 740000,
    location: 'Austin, Texas',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    propertyType: 'house'
  },
  {
    title: 'Penthouse with Skyline Views',
    description: 'Luxury penthouse featuring rooftop terrace and gym.',
    price: 2100000,
    location: 'Chicago, Illinois',
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    propertyType: 'apartment'
  },
  {
    title: 'Coastal Cottage',
    description: 'Charming cottage steps from the beach.',
    price: 560000,
    location: 'Charleston, South Carolina',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    propertyType: 'house'
  },
  {
    title: 'Urban Studio Loft',
    description: 'Industrial style studio in arts district.',
    price: 380000,
    location: 'Portland, Oregon',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    propertyType: 'apartment'
  },
  {
    title: 'Executive Estate',
    description: 'Grand estate with pool, tennis court, and guest house.',
    price: 6900000,
    location: 'Beverly Hills, California',
    bedrooms: 6,
    bathrooms: 7,
    area: 9000,
    propertyType: 'villa'
  },
  {
    title: 'Lakefront Retreat',
    description: 'Peaceful lakefront home with private dock.',
    price: 980000,
    location: 'Lake Tahoe, Nevada',
    bedrooms: 4,
    bathrooms: 3,
    area: 3000,
    propertyType: 'house'
  }
];

async function seed() {
  try {
    await connectDB();

    // Ensure an admin user exists
    let admin = await User.findOne({ email: 'admin@demo.com' }).select('+password');
    if (!admin) {
      admin = await User.create({
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'password',
        role: 'admin'
      });
      console.log('Created demo admin: admin@demo.com / password');
    }

    // Optional: clear existing demo properties
    await Property.deleteMany({});

    // Insert properties
    const docs = await Property.insertMany(
      propertiesSeed.map((p, idx) => ({
        ...p,
        images: [demoImages[idx % demoImages.length], demoImages[(idx + 1) % demoImages.length]],
        modelUrl: demoModels[idx % demoModels.length],
        owner: admin._id,
        featured: idx < 6
      }))
    );

    console.log(`Inserted ${docs.length} properties.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
