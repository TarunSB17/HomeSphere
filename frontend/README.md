# HomeSphere View - Frontend

Modern React frontend for HomeSphere View real estate platform with 3D model viewing capabilities.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

For production, set this to your deployed backend URL.

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## 🛠️ Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Three.js** - 3D rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.jsx
│   ├── PropertyCard.jsx
│   ├── Model3DViewer.jsx
│   └── SearchFilter.jsx
├── pages/           # Page components
│   ├── PropertyList.jsx
│   ├── PropertyDetail.jsx
│   ├── AddProperty.jsx
│   ├── MyProperties.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── context/         # React context
│   └── AuthContext.jsx
├── utils/           # Utility functions
│   └── axios.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🎨 Features

- **Authentication** - JWT-based login/register
- **Property Browsing** - Search, filter, and sort properties
- **3D Viewing** - Interactive 3D model viewer using Three.js
- **Property Management** - Add, view, and delete properties
- **Image Gallery** - Multiple image support with lightbox
- **Inquiry System** - Send inquiries to property owners
- **Responsive Design** - Mobile-first approach

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` - Your backend API URL

## 📝 Notes

- 3D models should be in GLB or GLTF format
- Images are automatically optimized by Cloudinary
- Authentication tokens are stored in localStorage
