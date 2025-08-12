import connectDB from './mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@careercompass.com' });
    
    if (!adminExists) {
      // Create admin user
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      const adminUser = new User({
        email: 'admin@careercompass.com',
        password: hashedPassword,
        name: 'Administrator',
        image: 'https://api.dicebear.com/8.x/initials/svg?seed=Admin',
        isAdmin: true,
        preferences: {
          theme: 'light',
          language: 'en'
        },
        todoList: [],
        history: [],
        savedItems: [],
        loginHistory: []
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Check if demo user exists
    const demoExists = await User.findOne({ email: 'demo@careercompass.com' });
    
    if (!demoExists) {
      // Create demo user
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('demo123', saltRounds);
      
      const demoUser = new User({
        email: 'demo@careercompass.com',
        password: hashedPassword,
        name: 'Demo User',
        image: 'https://api.dicebear.com/8.x/initials/svg?seed=Demo',
        isAdmin: false,
        preferences: {
          theme: 'light',
          language: 'en'
        },
        todoList: [
          {
            id: 'demo-todo-1',
            title: 'Complete career assessment',
            description: 'Take the AI-powered career assessment to discover your path',
            priority: 'high',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            completed: false,
            createdAt: new Date()
          },
          {
            id: 'demo-todo-2',
            title: 'Research potential careers',
            description: 'Explore the career recommendations provided',
            priority: 'medium',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            completed: false,
            createdAt: new Date()
          }
        ],
        history: [
          {
            id: 'demo-history-1',
            type: 'career_guidance',
            title: 'Career Assessment Completed',
            content: 'Initial career assessment completed successfully',
            timestamp: new Date(),
            metadata: { assessmentType: 'initial' }
          }
        ],
        savedItems: [
          {
            id: 'demo-saved-1',
            title: 'Software Development Career Path',
            content: 'Information about becoming a software developer',
            category: 'Career Paths',
            savedAt: new Date(),
            tags: ['technology', 'development', 'career']
          }
        ],
        loginHistory: []
      });

      await demoUser.save();
      console.log('✅ Demo user created successfully');
    } else {
      console.log('✅ Demo user already exists');
    }

    console.log('✅ Database initialization completed');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
