const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ No MONGODB_URI found in .env.local');
    process.exit(1);
  }

  console.log('Attempting to connect to MongoDB...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB. Error details:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
