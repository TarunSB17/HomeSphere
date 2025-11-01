# 🚀 HomeSphere View - Complete Setup Guide

This guide will walk you through setting up the complete HomeSphere View application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Cloudinary Account** - [Sign up free](https://cloudinary.com/)
- **Git** (optional but recommended)

## 🔧 Step-by-Step Setup

### 1. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Your connection string will be: `mongodb://localhost:27017/homesphere`

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/homesphere`)

### 2. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Note down:
   - Cloud Name
   - API Key
   - API Secret

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy .env.example to .env
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux

# Edit .env file with your credentials:
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/homesphere
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Start the development server
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
```

### 4. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux

# Edit .env file:
VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 5. Access the Application

Open your browser and go to: **http://localhost:3000**

## 🧪 Testing the Application

### 1. Register a New User
1. Click "Sign Up" in the navbar
2. Fill in your details
3. Click "Sign Up" button

### 2. Add a Property
1. After login, click "Add Property"
2. Fill in property details
3. Upload at least one image
4. (Optional) Upload a 3D model (.glb or .gltf file)
5. Click "Add Property"

### 3. Browse Properties
1. Go to home page
2. Use search and filters
3. Click on a property to view details
4. View 3D model if available

### 4. Send an Inquiry
1. On property detail page
2. Click "Send Inquiry"
3. Fill in the form
4. Submit

## 📦 Where to Get 3D Models?

Free 3D model resources:
- [Sketchfab](https://sketchfab.com/) - Search for architectural models
- [Poly Haven](https://polyhaven.com/) - Free 3D assets
- [CGTrader](https://www.cgtrader.com/) - Mix of free and paid
- [TurboSquid](https://www.turbosquid.com/) - Professional models

**Note:** Download models in GLB or GLTF format. If you get other formats, use [Blender](https://www.blender.org/) to convert.

## 🐛 Troubleshooting

### Backend won't start
- **Check MongoDB connection**: Verify your MONGO_URI is correct
- **Port already in use**: Change PORT in .env to 5001 or another port
- **Dependencies issue**: Delete `node_modules` and run `npm install` again

### Frontend won't start
- **Dependencies issue**: Delete `node_modules` and run `npm install` again
- **Port conflict**: Vite will automatically use next available port
- **API connection**: Ensure backend is running first

### Can't upload images/models
- **Check Cloudinary credentials**: Verify all three values (cloud name, API key, API secret)
- **File size**: Images should be < 10MB, models < 50MB
- **File format**: Images: jpg/png/webp, Models: glb/gltf only

### 3D model not displaying
- **File format**: Must be GLB or GLTF
- **Model size**: Very large models may take time to load
- **Browser console**: Check for loading errors

## 🚀 Production Deployment

### Frontend - Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "Import Project"
4. Select your repository
5. Set root directory to `frontend`
6. Add environment variable: `VITE_API_URL=your_backend_url`
7. Deploy

### Backend - Render

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Set:
   - Name: homesphere-backend
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add all environment variables from your `.env`
7. Create Web Service

### Alternative Backend Hosting
- **Railway**: Easy deployment with free tier
- **Heroku**: Popular choice
- **AWS/DigitalOcean**: More control but complex

## 📝 Important Notes

### Security
- Never commit `.env` files to Git
- Use strong JWT_SECRET in production
- Enable MongoDB authentication
- Use HTTPS in production

### Performance
- Optimize 3D models before upload (use Blender)
- Compress images before upload
- Enable CDN for static assets
- Add database indexes for better search

### Cloudinary Limits (Free Tier)
- 25 GB storage
- 25 GB bandwidth/month
- This is sufficient for testing and small projects

## 💡 Quick Commands Reference

### Backend
```bash
npm install          # Install dependencies
npm run dev         # Development mode with nodemon
npm start           # Production mode
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev         # Development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Three.js Journey](https://threejs-journey.com/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)

## 🆘 Need Help?

If you encounter issues:
1. Check the error message in terminal/console
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, backend, frontend) are running
4. Check browser console for frontend errors
5. Check terminal logs for backend errors

## ✅ Verification Checklist

Before deploying to production:

- [ ] MongoDB connection working
- [ ] Cloudinary uploads working
- [ ] User registration/login working
- [ ] Property creation working with images
- [ ] 3D model upload and viewing working
- [ ] Search and filters working
- [ ] Inquiry submission working
- [ ] All environment variables set
- [ ] No console errors
- [ ] Responsive on mobile devices

---

🎉 **Congratulations!** You now have a fully functional real estate platform with 3D viewing capabilities!
