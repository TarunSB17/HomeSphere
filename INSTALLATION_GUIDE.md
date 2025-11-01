# 📦 HomeSphere View - Complete Installation Guide

## 🚀 Quick Installation (5 Minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend** - Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://admin:admin123@cluster0.zrzb1ir.mongodb.net/homesphere?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Start Servers

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

### Step 4: Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 📋 Detailed Setup

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Code editor (VS Code recommended)

### 1. MongoDB Atlas Setup

#### Create Account:
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster (free tier)
4. Wait for cluster creation (~5 minutes)

#### Get Connection String:
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add `/homesphere` before `?retryWrites`

Example:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/homesphere?retryWrites=true&w=majority
```

#### Create Database User:
1. Database Access → Add New Database User
2. Username: `admin`
3. Password: `admin123` (or your choice)
4. Database User Privileges: Read and write to any database

#### Allow Network Access:
1. Network Access → Add IP Address
2. Choose "Allow Access from Anywhere" (for development)
3. Or add your specific IP

### 2. Cloudinary Setup

#### Create Account:
1. Go to https://cloudinary.com/
2. Sign up for free account
3. Verify email

#### Get Credentials:
1. Go to Dashboard
2. Copy these values:
   - Cloud Name
   - API Key
   - API Secret

3. Add to backend `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 3. Backend Installation

```bash
# Navigate to backend
cd backend

# Install all dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# Use any text editor

# Start development server
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
```

### 4. Frontend Installation

```bash
# Navigate to frontend
cd frontend

# Install all dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v7.1.12  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

---

## 🧪 Testing the Application

### 1. Register as Admin (Seller)

1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in details:
   - Name: John Seller
   - Email: admin@test.com
   - Phone: +1234567890
   - Role: **Seller/Admin**
   - Password: password123
4. Click "Sign Up"
5. Should redirect to homepage

### 2. Add First Property

1. Click "Add Property" in navbar
2. Fill property details:
   - Title: "Luxury Villa with Ocean View"
   - Description: "Beautiful 4-bedroom villa..."
   - Price: 850000
   - Location: "Miami, Florida"
   - Bedrooms: 4
   - Bathrooms: 3
   - Area: 3500
   - Type: Villa

3. Upload Images:
   - Click "Upload images"
   - Select 2-3 property images
   - See previews appear

4. (Optional) Upload 3D Model:
   - Download sample GLB from Sketchfab
   - Upload in "3D Model" section

5. Click "Add Property"
6. Should redirect to "My Properties"

### 3. View Admin Dashboard

1. Click "Dashboard" in navbar
2. Should see:
   - Total Properties: 1
   - Charts with data
   - Your property in "Most Viewed"

### 4. Register as Buyer

1. Click "Logout"
2. Click "Sign Up"
3. Fill details:
   - Name: Jane Buyer
   - Email: buyer@test.com
   - Role: **Buyer**
   - Password: password123
4. Click "Sign Up"

### 5. Test Buyer Features

1. **Browse Properties:**
   - See your property on homepage
   - Click property card to view details

2. **Add to Favorites:**
   - Click ❤️ heart icon
   - Should turn red
   - Click "My Favorites" in navbar
   - See saved property

3. **Send Inquiry:**
   - Go to property detail page
   - Click "Send Inquiry"
   - Fill form and submit
   - Should see success message

4. **View Map:**
   - Scroll down on property detail
   - See map (if coordinates provided)

5. **See Recommendations:**
   - Scroll to bottom of property detail
   - See "Similar Properties" section

### 6. Test Advanced Features

**Lightbox:**
- Click any property image
- Should open fullscreen
- Use arrows to navigate
- Press ESC to close

**3D Viewer:**
- If model uploaded, see 3D view
- Click and drag to rotate
- Scroll to zoom
- Right-click drag to pan

**Search & Filter:**
- Use search bar on homepage
- Apply filters
- Test sorting options

**View Tracking:**
- Visit property multiple times
- View count should increment
- Check admin dashboard for views

---

## 🔧 Troubleshooting

### Backend Won't Start

**Issue:** `Cannot connect to MongoDB`
**Solution:**
- Check MONGO_URI in .env
- Verify MongoDB Atlas IP whitelist
- Check database user credentials

**Issue:** `Port 5000 already in use`
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Issue:** `Cloudinary upload fails`
**Solution:**
- Verify CLOUDINARY credentials
- Check file size (< 10MB for images)
- Check file format (jpg, png, webp for images)

### Frontend Won't Start

**Issue:** `Dependencies error`
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue:** `Cannot connect to API`
**Solution:**
- Ensure backend is running
- Check VITE_API_URL in frontend/.env
- Verify port numbers match

**Issue:** `Map not displaying`
**Solution:**
- Check internet connection
- Leaflet CSS should be imported
- Verify latitude/longitude values

**Issue:** `Charts not rendering`
**Solution:**
```bash
npm install chart.js react-chartjs-2
```

**Issue:** `3D Model not loading`
**Solution:**
- Verify GLB/GLTF format
- Check file size (< 50MB)
- Ensure Cloudinary uploaded successfully
- Check browser console for errors

### Common Issues

**Favorites not working:**
- Ensure logged in as buyer
- Check localStorage for token
- Verify role in database

**Role-based navigation wrong:**
- Clear browser localStorage
- Re-login
- Check user.role in response

**Images not uploading:**
- Check Cloudinary credentials
- Verify file size limits
- Check network tab for errors

---

## 📱 Testing on Mobile

### Using Local Network:

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig | grep inet
   ```

2. Update frontend .env:
   ```env
   VITE_API_URL=http://YOUR_IP:5000
   ```

3. Update backend CORS (server.js):
   ```javascript
   app.use(cors({
     origin: '*' // For development only
   }));
   ```

4. Access on mobile:
   ```
   http://YOUR_IP:3000
   ```

---

## 🚀 Production Deployment

### Backend on Render:

1. Push code to GitHub
2. Go to https://render.com
3. New → Web Service
4. Connect repository
5. Settings:
   - Name: homesphere-backend
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables
7. Create Web Service

### Frontend on Vercel:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

4. Redeploy:
   ```bash
   vercel --prod
   ```

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register admin user
- [ ] Can register buyer user
- [ ] Can login both roles
- [ ] Can add property (admin)
- [ ] Can upload images
- [ ] Can upload 3D model (optional)
- [ ] Can view properties
- [ ] Can search/filter
- [ ] Can add to favorites (buyer)
- [ ] Can send inquiry
- [ ] Admin dashboard loads
- [ ] Charts display correctly
- [ ] Map displays on property page
- [ ] Lightbox works on images
- [ ] 3D viewer works (if model uploaded)
- [ ] Similar properties show
- [ ] View count increments
- [ ] Role-based navigation works

---

## 📊 Sample Data

### Admin User:
```
Email: admin@test.com
Password: password123
Role: Admin
```

### Buyer User:
```
Email: buyer@test.com
Password: password123
Role: Buyer
```

### Sample Property:
```
Title: Modern Apartment in Downtown
Price: 450000
Location: New York, NY
Bedrooms: 2
Bathrooms: 2
Area: 1200
Type: Apartment
Description: Beautiful modern apartment with city views...
```

---

## 🎯 Next Steps

1. **Customize:**
   - Change color scheme in tailwind.config.js
   - Update branding
   - Add your logo

2. **Enhance:**
   - Add more property types
   - Implement email notifications
   - Add property comparison

3. **Deploy:**
   - Follow production deployment guide
   - Set up custom domain
   - Configure SSL

4. **Monitor:**
   - Set up error tracking
   - Add analytics
   - Monitor performance

---

## 📞 Support

**Need Help?**
- Check ENHANCED_FEATURES.md for feature docs
- Review SETUP_GUIDE.md for detailed setup
- Check browser console for errors
- Verify all environment variables
- Ensure all dependencies installed

**Common Commands:**
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Check logs
# Backend: terminal output
# Frontend: browser console
```

---

## 🎉 Success!

If you've completed all steps, your HomeSphere View application is now running with all advanced features!

**Access your application at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

**Start exploring:**
1. Register users (both roles)
2. Add properties
3. Test all features
4. Customize as needed
5. Deploy to production

---

**Installation Complete!** 🚀  
**Ready to use:** ✅  
**All features working:** ✅

Happy developing! 🎊
