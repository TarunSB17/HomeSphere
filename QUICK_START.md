# ⚡ HomeSphere View - Quick Start

Get up and running in 5 minutes!

## 🚀 Super Quick Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open new terminal)
cd frontend
npm install
```

### 2. Setup Environment Variables

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/homesphere
PORT=5000
JWT_SECRET=mysecretkey123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open Browser

Navigate to: **http://localhost:3000**

## 🎯 First Steps

1. **Register** - Create your account
2. **Login** - Sign in
3. **Add Property** - Click "Add Property" and create your first listing
4. **Browse** - View all properties on the home page

## 📋 Required Accounts

Before starting, create free accounts at:

1. **MongoDB Atlas** (5 mins)
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up → Create cluster → Get connection string

2. **Cloudinary** (3 mins)
   - Go to: https://cloudinary.com/
   - Sign up → Dashboard → Copy credentials

## 🔧 Troubleshooting

### Backend won't start?
- Check if MongoDB is running
- Verify MONGO_URI in .env
- Ensure port 5000 is free

### Frontend won't start?
- Run `npm install` again
- Check if backend is running first
- Clear browser cache

### Can't upload files?
- Verify Cloudinary credentials
- Check file size (images < 10MB, models < 50MB)
- Ensure correct file format

## 📚 Need More Help?

- Read: `SETUP_GUIDE.md` for detailed instructions
- Check: `README.md` for full documentation
- Review: `PROJECT_SUMMARY.md` for technical details

## ✅ Quick Test

After setup, test these features:
- [ ] Register new user
- [ ] Login
- [ ] Add property with image
- [ ] View property list
- [ ] View property details
- [ ] Send inquiry
- [ ] View "My Properties"

## 🎉 You're Ready!

Your HomeSphere View application is now running locally!

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000  
**API Health**: http://localhost:5000/api

---

**Next Steps:**
- Add your first property
- Upload a 3D model (get free models from Sketchfab)
- Customize the UI colors in `tailwind.config.js`
- Deploy to production (see README.md)
