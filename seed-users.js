const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Read .env.local
let uri = process.env.MONGODB_URI;
if (!uri && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
  if (match) uri = match[1];
}

if (!uri) {
  console.error('❌ No MONGODB_URI found.');
  process.exit(1);
}

// User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'user' },
  watchlist: [{ type: Number }],
  favorites: [{ type: Number }],
  createdAt: { type: Date, default: Date.now },
});

const CustomMovieSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  poster_path: { type: String, required: true },
  release_date: { type: String, required: true },
  vote_average: { type: Number, default: 0 },
});

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const CustomMovie = mongoose.models.CustomMovie || mongoose.model('CustomMovie', CustomMovieSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

async function seed() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, {
      dbName: 'cinestop',
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB successfully!\n');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const sampleUsers = [
      {
        name: 'System Commander',
        email: 'admin@cinestop.com',
        password: adminPassword,
        role: 'admin',
        watchlist: [550, 680, 27205],
        favorites: [550, 27205],
      },
      {
        name: 'Vault Overseer',
        email: 'admin@movie.com',
        password: adminPassword,
        role: 'admin',
        watchlist: [157336],
        favorites: [157336],
      },
      {
        name: 'Sayanth Cinema',
        email: 'user@cinestop.com',
        password: userPassword,
        role: 'user',
        watchlist: [155, 597],
        favorites: [155],
      },
      {
        name: 'Neo Celluloid',
        email: 'neo@cinestop.com',
        password: userPassword,
        role: 'user',
        watchlist: [603],
        favorites: [603],
      },
    ];

    console.log('--- SEEDING USERS & ADMINS ---');
    for (const u of sampleUsers) {
      let doc = await User.findOne({ email: u.email });
      if (!doc) {
        doc = await User.create(u);
        console.log(` Created [${u.role.toUpperCase()}]: ${u.email}`);
      } else {
        doc.password = u.password;
        doc.role = u.role;
        doc.watchlist = u.watchlist;
        doc.favorites = u.favorites;
        await doc.save();
        console.log(` Updated [${u.role.toUpperCase()}]: ${u.email}`);
      }
    }

    // Custom Movie
    const customMovieData = {
      id: 9999001,
      title: 'CYBER CHAOS: 2099',
      overview: 'An underground rebellion fights against rogue corporate neural nets in neon neo-Tokyo. Pure adrenaline, raw synthwave, and brutal action.',
      poster_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
      release_date: '2026-10-31',
      vote_average: 9.8,
    };
    await CustomMovie.findOneAndUpdate({ id: customMovieData.id }, customMovieData, { upsert: true });
    console.log('\n Created / Updated Custom Vault Movie: CYBER CHAOS: 2099');

    // Review
    const adminDoc = await User.findOne({ email: 'admin@cinestop.com' });
    if (adminDoc) {
      await Review.findOneAndUpdate(
        { movieId: 550, user: adminDoc._id },
        {
          user: adminDoc._id,
          movieId: 550,
          rating: 5,
          text: 'Absolute timeless masterpiece. An adrenaline rush from start to finish with unmatched psychological depth!',
        },
        { upsert: true }
      );
      console.log(' Added sample review on Fight Club (ID 550)');
    }

    console.log('\n=============================================');
    console.log('✅ ALL SAMPLE LOGINS READY IN MONGODB:');
    console.log('=============================================');
    console.log('🛡️  ADMIN LOGIN 1:');
    console.log('   Email:    admin@cinestop.com');
    console.log('   Password: admin123');
    console.log('   Role:     admin (full access to /admin)');
    console.log('---------------------------------------------');
    console.log('🛡️  ADMIN LOGIN 2:');
    console.log('   Email:    admin@movie.com');
    console.log('   Password: admin123');
    console.log('   Role:     admin');
    console.log('---------------------------------------------');
    console.log('👤  USER LOGIN 1:');
    console.log('   Email:    user@cinestop.com');
    console.log('   Password: user123');
    console.log('   Role:     user');
    console.log('---------------------------------------------');
    console.log('👤  USER LOGIN 2:');
    console.log('   Email:    neo@cinestop.com');
    console.log('   Password: user123');
    console.log('   Role:     user');
    console.log('=============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed with error:');
    console.error(err.message);
    process.exit(1);
  }
}

seed();
