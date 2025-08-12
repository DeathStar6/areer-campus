import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, name } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name,
      image: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`,
      isAdmin: false,
      preferences: {
        theme: 'light',
        language: 'en'
      },
      todoList: [],
      history: [],
      savedItems: [],
      loginHistory: []
    });

    await newUser.save();

    // Return user data (without password)
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin,
      preferences: newUser.preferences
    };

    return NextResponse.json({
      success: true,
      user: userData
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
