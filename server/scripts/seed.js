const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shilpkari';
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  console.log('Seeding database...');
  await User.deleteMany({});
  await Product.deleteMany({});

  const artisan = await User.create({
    name: 'Demo Artisan',
    email: 'artisan@demo.com',
    password: 'password123',
    role: 'artisan',
    language: 'en',
    artisanProfile: {
      businessName: 'Demo Crafts',
      description: 'Authentic handcrafted products',
      specialties: ['pottery', 'woodwork']
    }
  });

  const buyer = await User.create({
    name: 'Demo Buyer',
    email: 'buyer@demo.com',
    password: 'password123',
    role: 'buyer',
    language: 'en'
  });

  await Product.create([
    {
      artisan: artisan._id,
      name: 'Handcrafted Pottery Vase',
      description: 'Beautiful clay vase made by skilled artisan.',
      category: 'pottery',
      price: 2500,
      images: [{ url: '', alt: 'Pottery Vase', isPrimary: true }],
      inventory: { total: 20, available: 20 }
    },
    {
      artisan: artisan._id,
      name: 'Wooden Sculpture',
      description: 'Traditional wooden sculpture with intricate carvings.',
      category: 'woodwork',
      price: 5500,
      images: [{ url: '', alt: 'Wooden Sculpture', isPrimary: true }],
      inventory: { total: 10, available: 10 }
    }
  ]);

  console.log('Seeded demo users and products');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});


