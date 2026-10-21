import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign admin role if specified, or if email starts with admin@
    const assignedRole = (role === 'admin' || normalizedEmail === 'admin@cinestop.com' || normalizedEmail.startsWith('admin@'))
      ? 'admin'
      : 'user';

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
    });

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        userId: newUser._id,
        role: assignedRole 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    const errorMsg = error?.message || 'Internal Server Error';
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
