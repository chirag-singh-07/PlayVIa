const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config({ path: './backend/.env' });

const categories = [
  { name: 'Entertainment', icon: 'film' },
  { name: 'Music', icon: 'musical-notes' },
  { name: 'Gaming', icon: 'game-controller' },
  { name: 'Education', icon: 'book' },
  { name: 'Technology', icon: 'hardware-chip' },
  { name: 'Vlogs', icon: 'camera' },
  { name: 'News', icon: 'newspaper' },
  { name: 'Sports', icon: 'football' },
  { name: 'Comedy', icon: 'happy' },
  { name: 'Cooking', icon: 'restaurant' },
  { name: 'Fashion', icon: 'shirt' },
  { name: 'Travel', icon: 'airplane' },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    await Category.deleteMany();
    console.log('Existing categories cleared.');

    const categoriesWithSlugs = categories.map(cat => ({
      ...cat,
      slug: cat.name.toLowerCase().replace(/ /g, '-'),
    }));

    await Category.insertMany(categoriesWithSlugs);
    console.log('Categories seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedCategories();
