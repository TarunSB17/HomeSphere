# ✅ GLB File Upload - FIXED!

## Problem Solved

The multer middleware was rejecting GLB files because it only had an image filter. Now it accepts both images and GLB files!

---

## What Changed

### Backend: `config/localStorage.js`
- **Before**: Separate multer instances with strict filters
- **After**: Combined multer instance with field-based filtering
  - `images` field → Accepts: JPG, JPEG, PNG, GIF, WEBP
  - `model` field → Accepts: GLB, GLTF

### Frontend: `pages/AddProperty.jsx`
- Added clear instructions about GLB upload
- Better visual feedback
- File size info (up to 50MB)

---

## How It Works

### File Storage (NOT in MongoDB!)

```
User uploads GLB file
    ↓
Multer saves to: backend/uploads/models/model-123456.glb
    ↓
Backend generates URL: http://localhost:5000/uploads/models/model-123456.glb
    ↓
URL stored in MongoDB property document (modelUrl field)
    ↓
Frontend fetches property → Gets modelUrl → Displays 3D viewer
```

**Important**: 
- ✅ Files stored in: `backend/uploads/` folder (on disk)
- ✅ MongoDB stores: URL strings only
- ✅ No file size limit in MongoDB (it's just a URL string)
- ✅ Disk space is the only limit

---

## MongoDB Storage

**What's stored in MongoDB**:
```json
{
  "title": "Beautiful Villa",
  "images": [
    "http://localhost:5000/uploads/images/img-123.jpg",
    "http://localhost:5000/uploads/images/img-456.jpg"
  ],
  "modelUrl": "http://localhost:5000/uploads/models/model-789.glb",
  "price": 500000,
  ...
}
```

**Size in MongoDB**: ~200-500 bytes per property (just text/URLs)

---

## File Size Limits

### Images:
- Max per image: 10MB (multer limit)
- Max total: Up to 10 images = 100MB total
- Stored in: `backend/uploads/images/`

### 3D Models:
- Max per model: 50MB (multer limit)
- Format: GLB or GLTF
- Stored in: `backend/uploads/models/`

### MongoDB:
- No file size limit (only stores URLs)
- Each URL ≈ 50-100 bytes

---

## How to Upload GLB File

### Step 1: Restart Backend
```bash
cd backend
npm start
```

### Step 2: Go to Add Property
1. Login as seller
2. Click "Add Property"
3. Scroll to "3D Model (Optional)" section

### Step 3: Upload GLB File
1. Click "Upload 3D Model (.glb or .gltf)"
2. Select your .glb file (up to 50MB)
3. File name appears in blue box
4. Fill rest of form
5. Click "Add Property"

### Step 4: Verify Upload
1. Check backend console:
   ```
   [files] fields: images, model
     - field images: 2 file(s)
     - field model: 1 file(s)
       • [model#0] name=house.glb mime=model/gltf-binary size=5242880 path=...
   ```
2. Check folder: `backend/uploads/models/`
3. Should see: `model-123456789.glb`

---

## Where to Get GLB Files

### Free 3D Model Sites:
1. **Sketchfab** - https://sketchfab.com/
   - Filter by "Downloadable"
   - Choose "GLB" format
   
2. **Poly Haven** - https://polyhaven.com/
   - Free, high-quality models
   - Download as GLB

3. **TurboSquid** - https://www.turbosquid.com/
   - Some free models
   - Look for GLB format

4. **CGTrader** - https://www.cgtrader.com/
   - Free and paid models

### Convert Existing Models:
- Use Blender (free) to convert OBJ/FBX to GLB
- Online converters: https://products.aspose.app/3d/conversion

---

## File Structure

```
backend/
├── uploads/
│   ├── images/
│   │   ├── img-1234567890-123456789.jpg
│   │   ├── img-1234567890-987654321.jpg
│   │   └── ...
│   └── models/
│       ├── model-1234567890-123456789.glb
│       └── ...
└── config/
    └── localStorage.js  ← Handles file uploads
```

---

## Troubleshooting

### "Only image files are allowed" error
**Fixed!** Restart backend and try again.

### GLB file not uploading
1. Check file size (< 50MB)
2. Check file extension (.glb or .gltf)
3. Check backend console for errors
4. Verify `backend/uploads/models/` folder exists

### File uploaded but not showing
1. Check `modelUrl` field in MongoDB
2. Visit the URL directly in browser
3. Should download the GLB file
4. Check Model3DViewer component

### Model appears in form but not saved
1. Check backend console logs
2. Look for file path and URL conversion
3. Verify multer processed the file
4. Check property document in MongoDB

---

## Testing Checklist

- [ ] Backend restarted
- [ ] Can select GLB file in form
- [ ] File name shows in blue box
- [ ] Form submits successfully
- [ ] Backend logs show model file
- [ ] File exists in `backend/uploads/models/`
- [ ] Property has `modelUrl` in MongoDB
- [ ] Can access model URL in browser

---

## Summary

✅ **Files on disk**: Images and GLB models stored in `backend/uploads/`  
✅ **URLs in MongoDB**: Only file paths/URLs stored in database  
✅ **No MongoDB size limit**: Database stores text, not files  
✅ **50MB GLB limit**: Set by multer, can be increased if needed  

**Your GLB files now upload successfully!** 🎉
