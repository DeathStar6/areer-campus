# Career Compass 🧭

An AI-powered career guidance platform that helps students discover their perfect career paths through personalized recommendations.

## ✨ Features

- **AI-Powered Career Guidance**: Get personalized recommendations using Google Gemini AI
- **Comprehensive Academic Coverage**: 14+ study levels, 50+ course categories, 100+ specializations
- **Future Studies Suggestions**: AI-generated recommendations for advanced studies
- **Career Opportunities**: Job and placement suggestions based on your profile
- **College Recommendations**: Top institutions for your chosen field
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Admin Panel**: User management and system monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-compass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google Gemini AI API Key
   # Get your API key from: https://makersuite.google.com/app/apikey
   GEMINI_API_KEY=your_actual_api_key_here
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_NAME="Career Compass"
   NEXT_PUBLIC_APP_DESCRIPTION="AI-powered career guidance for students"
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

### Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:9002`

2. **AI development server** (optional)
   ```bash
   npm run genkit:dev
   ```

3. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🎯 Usage

### For Students
1. **Sign In**: Use any email address to access the platform
2. **Select Your Profile**: Choose your study level, course, and specialization
3. **Get AI Recommendations**: Receive personalized suggestions for:
   - Future studies and advanced programs
   - Career opportunities and job placements
   - Top colleges and institutions

### For Administrators
- **Admin Access**: Use `admin@careercompass.com` to access the admin panel
- **User Management**: Monitor user activity and manage accounts
- **System Monitoring**: Check system health and performance metrics

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: Google Gemini AI via Genkit framework
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Context + custom hooks
- **Form Handling**: React Hook Form with Zod validation

## 🎨 Design System

- **Colors**: Modern blue-purple gradient palette
- **Typography**: Inter font family for excellent readability
- **Components**: Glass morphism effects and smooth animations
- **Responsive**: Mobile-first design approach
- **Dark Mode**: Full dark mode support

## 🔧 Configuration

### Customizing Career Data
Edit `src/lib/data.ts` to modify:
- Study levels and courses
- Specializations and their mappings
- Language and country options

### AI Prompts
Customize AI behavior in `src/ai/flows/generate-career-suggestions.ts`:
- Modify prompt templates
- Adjust response schemas
- Add new suggestion types

### Styling
Update design tokens in:
- `src/app/globals.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration

## 🚨 Troubleshooting

### API Key Issues
If you see "fetch failed" errors:
1. Check that your `.env.local` file exists
2. Verify your Gemini API key is correct
3. Ensure the API key has proper permissions
4. Check your internet connection

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run typecheck`

### Performance Issues
- Use `npm run dev` with Turbopack for faster development
- Monitor bundle size with `npm run build`
- Check for memory leaks in development

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] User authentication with real backend
- [ ] Database integration for user data
- [ ] Advanced AI algorithms for better recommendations
- [ ] Mobile app development
- [ ] Integration with job boards and educational platforms
- [ ] Analytics and user behavior tracking
- [ ] Multi-language support expansion

---

**Made with ❤️ for students worldwide**
