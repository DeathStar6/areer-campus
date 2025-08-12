# MongoDB Setup for Career Compass

## 🚀 Quick Start

### 1. Install MongoDB
- **Windows**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow [official installation guide](https://docs.mongodb.com/manual/installation/)

### 2. Start MongoDB Service
```bash
# Windows (as Administrator)
net start MongoDB

# macOS/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### 3. Create Environment File
Create `.env.local` in your project root:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/career-compass

# Google Gemini API Key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Initialize Database
```bash
# Start your Next.js app
npm run dev

# In another terminal, initialize the database
curl -X POST http://localhost:3000/api/init-db
```

## 📊 Database Features

### User Management
- ✅ **User Registration**: Secure password hashing with bcrypt
- ✅ **User Authentication**: Login with email/password
- ✅ **Login History**: Track all login attempts (success/failure)
- ✅ **IP Address Logging**: Monitor user access locations
- ✅ **User Agent Tracking**: Browser/device information

### Admin Panel
- ✅ **User Overview**: Total users, active users, admin count
- ✅ **Login Statistics**: Successful vs failed login attempts
- ✅ **User Management**: Add, delete, modify user permissions
- ✅ **Password Management**: Admin can change user passwords
- ✅ **System Monitoring**: Database health and performance metrics

### Data Models
- ✅ **User Profile**: Name, email, preferences, avatar
- ✅ **Todo Management**: Tasks with priority and due dates
- ✅ **Activity History**: Career guidance, completed tasks, saved items
- ✅ **Login Tracking**: Timestamp, IP, user agent, success status

## 🔐 Default Users

### Admin User
- **Email**: `admin@careercompass.com`
- **Password**: `admin123`
- **Access**: Full admin privileges

### Demo User
- **Email**: `demo@careercompass.com`
- **Password**: `demo123`
- **Access**: Regular user with sample data

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Management
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/[id]/password` - Change user password
- `PUT /api/users/[id]/admin` - Toggle admin status
- `DELETE /api/users/[id]` - Delete user

### Database
- `POST /api/init-db` - Initialize database with default users

## 📈 Login Analytics

The system tracks:
- **Login Attempts**: Success/failure rates
- **IP Addresses**: Geographic distribution of users
- **User Agents**: Browser and device information
- **Timestamps**: Login patterns and frequency
- **Failed Attempts**: Security monitoring

## 🔒 Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **Input Validation**: Email format and required fields
- **Access Control**: Admin-only routes protected
- **Rate Limiting**: Built-in protection against brute force
- **Data Sanitization**: XSS and injection protection

## 🚨 Troubleshooting

### Connection Issues
```bash
# Check MongoDB status
mongo --eval "db.serverStatus()"

# Check if port 27017 is open
netstat -an | grep 27017
```

### Database Errors
```bash
# Access MongoDB shell
mongo career-compass

# Check collections
show collections

# View users
db.users.find().pretty()
```

### Reset Database
```bash
# Drop and recreate database
mongo career-compass --eval "db.dropDatabase()"

# Reinitialize
curl -X POST http://localhost:3000/api/init-db
```

## 📱 Usage Examples

### Login with Demo Account
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'demo@careercompass.com',
    password: 'demo123'
  })
});
```

### Get All Users (Admin Only)
```javascript
const response = await fetch('/api/users');
const data = await response.json();
console.log(data.users); // Array of users with login history
```

## 🎯 Next Steps

1. **Production Setup**: Use MongoDB Atlas for cloud hosting
2. **Backup Strategy**: Implement automated database backups
3. **Monitoring**: Add performance monitoring and alerts
4. **Analytics**: Enhanced user behavior tracking
5. **Security**: Implement JWT tokens and session management

---

**Need Help?** Check the console logs for detailed error messages and ensure MongoDB is running on port 27017.
