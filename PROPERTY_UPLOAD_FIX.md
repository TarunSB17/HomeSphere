# 🔧 Property Upload Fix - CRITICAL

## Issues Fixed

### 1. ✅ CSS Import Order
**Problem**: PostCSS error about `@import` placement  
**Fix**: Moved Leaflet import to top of `frontend/src/index.css`

### 2. ✅ Multer Upload Handler
**Problem**: Connection reset when uploading files  
**Fix**: Changed to single `uploadImages.fields()` middleware

### 3. ✅ Body Size Limits
**Problem**: Large images causing connection reset  
**Fix**: Increased to 50MB in `backend/server.js`

### 4. ✅ Seller Role Support
**Problem**: Only admins could list properties  
**Fix**: Added `canList` middleware for sellers + admins

---

## 🚨 RESTART BACKEND NOW

```bash
cd backend
npm start
```

**Must see these:**
- ✅ MongoDB Connected: ...
- 🚀 Server running on port 5000

---

## 🧪 Test Property Upload (Step by Step)

### Step 1: Check Backend Health
Visit: **http://localhost:5000/api/health**

Should return:
```json
{"status":"healthy","database":"connected","cloudinary":true}
```

### Step 2: Register as Seller
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill form
4. **Select "Seller - Listing properties"** (critical!)
5. Complete registration

### Step 3: Add Property
1. Log in as seller
2. Click "Add Property" (blue button, right side)
3. Fill minimal test:
   - Title: `Test House`
   - Description: `Test description`
   - Price: `500000`
   - Location: `New York`
4. Upload **1 small image** (< 2MB)
5. Click "Add Property"

### Step 4: Check Backend Console
Should see:
```
Creating property - User: your@email.com
Request body: {...}
Request files: { images: [...] }
Creating property with data: {...}
Property created successfully: <id>
```

---

## ❌ Still Getting Errors?

### Error: ERR_CONNECTION_RESET

**Check 1**: Is backend running?
```bash
# Visit http://localhost:5000
# Should show: "Welcome to DreamHomes API"
```

**Check 2**: Is Cloudinary configured?
```bash
# In backend/.env, check:
CLOUDINARY_URL=cloudinary://489182927516246:814917979933541@dpu6txhox
```

**Check 3**: Is MongoDB connected?
```bash
# Backend console should show:
# ✅ MongoDB Connected: cluster...mongodb.net
```

**Fix**: If backend crashes on startup:
1. Check `.env` has all required vars
2. Check MongoDB URI is valid
3. Try: `npm install` in backend

### Error: "Access denied. Sellers or Admins only"

**Problem**: Logged in as Buyer  
**Fix**: Logout, register NEW account as "Seller"

### Error: "Network Error" in browser

**Problem**: Frontend can't reach backend  
**Fix**: 
1. Ensure backend is on port 5000
2. Ensure frontend is on port 3000 (Vite default)
3. Check browser console - should show Authorization header

---

## 📸 Minimal Test Data

Use this for quick test:
- **Title**: Test
- **Description**: Test property
- **Price**: 100000
- **Location**: NYC
- **Image**: Any JPG/PNG under 500KB

---

## ✅ Success Checklist

- [ ] Backend shows "Property created successfully"
- [ ] Frontend shows green toast "Property added successfully!"
- [ ] Redirects to "My Properties" page
- [ ] Property appears in list
- [ ] Image visible in property card
- [ ] Check MongoDB - new document exists
- [ ] Check Cloudinary dashboard - image uploaded

---

## 🆘 Still Not Working?

**Share these 3 things:**
1. Backend console output (full startup + error)
2. Browser console error (exact message)
3. Your `.env` file (hide passwords!)

---

## 🎯 Quick Commands

```bash
# Restart backend
cd backend
npm start

# Check health
curl http://localhost:5000/api/health

# Seed demo properties
npm run seed
```

---

**Last Updated**: After fixing multer fields() handler
