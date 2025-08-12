import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all users with their login history
    const users = await User.find({}, {
      password: 0, // Exclude password
      __v: 0
    }).sort({ createdAt: -1 });

    // Transform the data to include login statistics
    const usersWithStats = users.map(user => {
      const successfulLogins = user.loginHistory.filter(login => login.success).length;
      const failedLogins = user.loginHistory.filter(login => !login.success).length;
      const lastSuccessfulLogin = user.loginHistory
        .filter(login => login.success)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        todoList: user.todoList,
        history: user.history,
        savedItems: user.savedItems,
        stats: {
          totalLogins: user.loginHistory.length,
          successfulLogins,
          failedLogins,
          lastSuccessfulLogin: lastSuccessfulLogin?.timestamp || null,
          lastLoginAttempt: user.loginHistory[user.loginHistory.length - 1]?.timestamp || null
        },
        recentLoginAttempts: user.loginHistory.slice(-10) // Last 10 login attempts
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      totalUsers: usersWithStats.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
