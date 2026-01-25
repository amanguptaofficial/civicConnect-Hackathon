# CivicConnect - Civic Engagement Platform

A modern web platform that bridges the gap between citizens and government, enabling real-time reporting, tracking, and resolution of civic issues.

## 🚀 Features

- **Multi-role Authentication** (Citizen, Policymaker, Admin)
- **Proposal Management** with AI-powered analysis
- **Real-time Engagement** (Voting, Comments, Feedback)
- **Interactive Maps** for geographic visualization
- **Government Dashboard** with analytics
- **AI Integration** for content summarization and sentiment analysis
- **Real-time Notifications**
- **File Uploads & Attachments**
- **Responsive Design** (Mobile & Desktop)

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **React Hook Form** for form handling
- **Framer Motion** for animations
- **Leaflet** for interactive maps
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time communication
- **OpenAI API** for AI features
- **AWS S3** for file storage
- **Multer** for file uploads
- **Nodemailer** for email notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git
- AWS S3 bucket (for file uploads)
- OpenAI API key (for AI features)

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Nextvoid-hackathon
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/civicconnect
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/civicconnect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-s3-bucket-name

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Map Configuration (optional)
VITE_MAPBOX_TOKEN=your-mapbox-token-if-using-mapbox

# App Configuration
VITE_APP_NAME=CivicConnect
VITE_APP_VERSION=1.0.0
```

#### Start Frontend Development Server

```bash
npm run dev
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` file

### 5. Create Initial Users

#### Create Admin User
```bash
cd backend
npm run create-admin admin@government.gov password123 "Admin" "User"
```

#### Seed Dummy Data (Optional)
```bash
cd backend
npm run seed-dummy
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 👥 User Roles & Access

### 1. Citizen
- Register and login
- Create proposals
- Vote and comment
- View dashboard
- Provide feedback

### 2. Policymaker
- All citizen features
- Government dashboard
- Proposal status management
- Analytics access
- Government responses

### 3. Admin
- All features
- User management
- System administration
- Content moderation
- Full analytics

## 📁 Project Structure

```
Nextvoid-hackathon/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Utility scripts
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Helper utilities
│   ├── .env                 # Backend environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   └── utils/           # Helper utilities
│   ├── .env                 # Frontend environment variables
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run create-admin   # Create admin user
npm run seed-dummy     # Seed dummy data
npm run migrate        # Run database migrations
```

### Frontend Scripts
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
```

## 🔐 Default Credentials

After setup, you can use these credentials to explore:

### Admin User
- **Email**: admin@government.gov
- **Password**: password123

### Test Citizen
- **Email**: amangupta5132@gmail.com
- **Password**: (created during registration)

## 🚀 Deployment

### Backend Deployment (Heroku Example)
```bash
# Install Heroku CLI
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for cloud databases

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check frontend `VITE_API_URL` configuration

3. **Authentication Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration settings

4. **File Upload Issues**
   - Verify AWS S3 credentials
   - Check bucket permissions
   - Ensure bucket name is unique

5. **AI Features Not Working**
   - Verify OpenAI API key
   - Check API quota and billing

### Development Tips

- Use `npm run dev` for hot reloading during development
- Check browser console for frontend errors
- Check terminal for backend errors
- Use MongoDB Compass for database visualization
- Test API endpoints with Postman or similar tools

## 📞 Support

For support or questions:
- **Email**: amangupta5132@gmail.com
- **Phone**: +91 7525051783

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Built with ❤️ for better civic engagement**
