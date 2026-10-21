import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import CustomMovie from '@/models/Movie';
import Review from '@/models/Review';

export async function GET() {
  try {
    await connectMongo();

    const [usersCount, customMoviesCount, reviewsCount] = await Promise.all([
      User.countDocuments().catch(() => 0),
      CustomMovie.countDocuments().catch(() => 0),
      Review.countDocuments().catch(() => 0),
    ]);

    return NextResponse.json({
      connected: true,
      readyState: mongoose.connection.readyState,
      dbName: mongoose.connection.db?.databaseName || 'cinestop',
      usersCount,
      customMoviesCount,
      reviewsCount,
      message: 'MongoDB is connected and fully operational!',
    });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isIpBlocked = errorMsg.includes('whitelist') || errorMsg.includes('whitelisted') || errorMsg.includes('SSL alert number 80') || errorMsg.includes('tlsv1 alert internal error') || errorMsg.includes('serverSelectionTimeoutMS');

    return NextResponse.json({
      connected: false,
      readyState: mongoose.connection.readyState,
      error: errorMsg,
      isIpBlocked,
      recommendedIp: '103.175.137.253',
      message: isIpBlocked
        ? 'MongoDB Atlas rejected connection (SSL Alert 80). Your current IP (103.175.137.253) must be added to MongoDB Atlas Network Access.'
        : `Database connection failed: ${errorMsg}`,
    }, { status: 200 }); // Return 200 so UI can display status banner gracefully
  }
}
