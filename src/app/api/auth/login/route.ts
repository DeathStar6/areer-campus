import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Log failed login attempt
      await logLoginAttempt(email, false, request);
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Log failed login attempt
      await logLoginAttempt(email, false, request);
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login time
    user.lastLogin = new Date();
    
    // Log successful login
    await logLoginAttempt(email, true, request);
    
    // Save user
    await user.save();

    // Return user data (without password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      preferences: user.preferences
    };

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function logLoginAttempt(email: string, success: boolean, request: NextRequest) {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      user.loginHistory.push({
        timestamp: new Date(),
        ipAddress: clientIP,
        userAgent: userAgent,
        success: success
      });
      
      // Keep only last 50 login attempts
      if (user.loginHistory.length > 50) {
        user.loginHistory = user.loginHistory.slice(-50);
      }
      
      await user.save();
    }
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
}
