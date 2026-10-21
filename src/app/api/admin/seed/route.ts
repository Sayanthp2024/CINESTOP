import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CustomMovie from '@/models/Movie';
import Review from '@/models/Review';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await dbConnect();

    // 1. Seed Sample Users & Admins
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const sampleUsers = [
      {
        name: 'System Commander',
        email: 'admin@cinestop.com',
        password: adminPassword,
        role: 'admin',
        watchlist: [550, 680, 27205], // Fight Club, Pulp Fiction, Inception
        favorites: [550, 27205],
      },
      {
        name: 'Vault Overseer',
        email: 'admin@movie.com',
        password: adminPassword,
        role: 'admin',
        watchlist: [157336], // Interstellar
        favorites: [157336],
      },
      {
        name: 'Sayanth Cinema',
        email: 'user@cinestop.com',
        password: userPassword,
        role: 'user',
        watchlist: [155, 597], // The Dark Knight, Titanic
        favorites: [155],
      },
      {
        name: 'Neo Celluloid',
        email: 'neo@cinestop.com',
        password: userPassword,
        role: 'user',
        watchlist: [603], // The Matrix
        favorites: [603],
      },
    ];

    const createdUsers = [];
    for (const u of sampleUsers) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create(u);
      } else {
        // Update password and role to ensure sample logins work
        existing.password = u.password;
        existing.role = u.role;
        if (!existing.watchlist || existing.watchlist.length === 0) existing.watchlist = u.watchlist;
        if (!existing.favorites || existing.favorites.length === 0) existing.favorites = u.favorites;
        await existing.save();
      }
      createdUsers.push({ name: existing.name, email: existing.email, role: existing.role });
    }

    // 2. Seed a Custom Vault Movie into MongoDB
    const sampleMovie = {
      id: 9999001,
      title: 'CYBER CHAOS: 2099',
      overview: 'An underground rebellion fights against rogue corporate neural nets in neon neo-Tokyo. Pure adrenaline, raw synthwave, and brutal action.',
      poster_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
      release_date: '2026-10-31',
      vote_average: 9.8,
    };

    let existingMovie = await CustomMovie.findOne({ id: sampleMovie.id });
    if (!existingMovie) {
      await CustomMovie.create(sampleMovie);
    }

    // 3. Seed Sample Community Review
    const adminUser = await User.findOne({ email: 'admin@cinestop.com' });
    if (adminUser) {
      const existingReview = await Review.findOne({ movieId: 550, user: adminUser._id });
      if (!existingReview) {
        await Review.create({
          user: adminUser._id,
          movieId: 550,
          rating: 5,
          text: 'Absolute timeless masterpiece. An adrenaline rush from start to finish with unmatched psychological depth!',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sample users, admins, custom vault movie, and reviews seeded successfully in MongoDB!',
      sampleLogins: [
        {
          role: 'ADMIN',
          email: 'admin@cinestop.com',
          password: 'admin123',
          description: 'Full admin access to moderating reviews, injecting custom movies, and viewing users.',
        },
        {
          role: 'ADMIN (Alternative)',
          email: 'admin@movie.com',
          password: 'admin123',
          description: 'Secondary admin account.',
        },
        {
          role: 'USER (General)',
          email: 'user@cinestop.com',
          password: 'user123',
          description: 'Standard operative account with pre-loaded Hit List & Obsessions.',
        },
        {
          role: 'USER (Alternative)',
          email: 'neo@cinestop.com',
          password: 'user123',
          description: 'Second sample user for testing multi-user reviews and interactions.',
        },
      ],
      users: createdUsers,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to seed sample data' },
      { status: 500 }
    );
  }
}

// Allow GET as well for simple browser triggering
export async function GET() {
  return POST();
}
