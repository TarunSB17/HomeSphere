# 🏠 HomeSphere View

A full-stack MERN real estate property listing web application with integrated 3D model viewing capabilities.

![Tech Stack](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🏘️ **Property Listings** - Browse properties with advanced search and filters
- 🎮 **3D Model Viewer** - Interactive 3D property models using Three.js
- 📸 **Image Gallery** - Multiple image upload support
- 🔍 **Search & Filter** - Filter by price, type, location, and more
- 💬 **Inquiry System** - Buyers can send inquiries to property owners
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- ☁️ **Cloud Storage** - Cloudinary integration for images and 3D models

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- Three.js (@react-three/fiber & @react-three/drei)
- React Router
- Axios
- Lucide React (icons)
- React Hot Toast (notifications)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (image & 3D model storage)
- Multer (file uploads)
- Bcrypt (password hashing)

## 📁 Project Structure

```
home-sphere-view/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database & Cloudinary config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & error middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   └── package.json
│
└── frontend/               # React + Vite app
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── context/        # React context
    │   ├── utils/          # Utility functions
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Protected)
- `PUT /api/properties/:id` - Update property (Protected)
- `DELETE /api/properties/:id` - Delete property (Protected)
- `GET /api/properties/my/listings` - Get user's properties (Protected)

### Inquiries
- `POST /api/inquiry` - Submit inquiry
- `GET /api/inquiry` - Get all inquiries (Protected)
- `GET /api/inquiry/property/:propertyId` - Get property inquiries (Protected)
- `PUT /api/inquiry/:id` - Update inquiry status (Protected)

## 🎨 Key Features Explained

### 3D Model Viewing
- Upload GLB/GLTF 3D models
- Interactive viewer with orbit controls
- Zoom, pan, and rotate functionality
- Automatic lighting and staging

### Property Management
- Add properties with images and 3D models
- Edit and delete your listings
- Track property status (available/sold/rented)

### Search & Filter
- Text search across title, description, and location
- Filter by price range
- Filter by property type
- Sort by price or date

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render)
1. Create new Web Service on Render
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

## 🔒 Environment Variables

### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend
- `VITE_API_URL` - Backend API URL

## 📝 Usage Flow

1. **User Registration/Login** - Create account or login
2. **Browse Properties** - View all available properties
3. **Filter & Search** - Find properties matching criteria
4. **View Details** - See property details and 3D model
5. **Send Inquiry** - Contact property owner
6. **Add Property** (Authenticated) - List your own property
7. **Manage Properties** (Authenticated) - View/delete your listings

## 🎯 Future Enhancements

- [ ] Email notifications for inquiries
- [ ] Property comparison feature
- [ ] Favorites/Wishlist
- [ ] Advanced map integration
- [ ] Property reviews and ratings
- [ ] Admin dashboard
- [ ] Payment integration

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer Notes

- All API routes are prefixed with `/api`
- Authentication uses JWT tokens stored in localStorage
- 3D models should be optimized (< 50MB)
- Images are automatically compressed by Cloudinary
- CORS is enabled for cross-origin requests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using the MERN stack
