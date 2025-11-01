import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import FloatingChatButton from './components/FloatingChatButton';
import PropertyList from './pages/PropertyList';
import AddProperty from './pages/AddProperty';
import MyProperties from './pages/MyProperties';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PropertyDetail from './pages/PropertyDetail';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/properties"
                  element={
                    <ProtectedRoute>
                      <PropertyList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/properties/:id"
                  element={
                    <ProtectedRoute>
                      <PropertyDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-property"
                  element={
                    <ProtectedRoute>
                      <AddProperty />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-properties"
                  element={
                    <ProtectedRoute>
                      <MyProperties />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller-dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
              <FloatingChatButton />
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: 'backdrop-blur-lg bg-white/90 dark:bg-gray-800/90',
                  style: {
                    borderRadius: '12px',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

