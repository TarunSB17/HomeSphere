import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import Model3DModal from '../components/Model3DModal';
import SEOHead from '../components/SEOHead';
import toast from 'react-hot-toast';
import { Loader, Heart } from 'lucide-react';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [is3DOpen, setIs3DOpen] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'buyer') {
      toast.error('Only buyers can access favorites');
      navigate('/');
      return;
    }

    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/favorites');
      setFavorites(data);
    } catch (error) {
      toast.error('Failed to fetch favorites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setIsDetailsOpen(true);
  };

  const handleView3D = (property) => {
    if (!property?.modelUrl) return;
    setModelUrl(property.modelUrl);
    setIs3DOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <SEOHead title="My Favorites - HomeSphere View" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Favorites</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Properties you've saved for later</p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onViewDetails={handleViewDetails}
                onView3D={handleView3D}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start exploring properties and save your favorites!
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* 3D Modal */}
      <Model3DModal
        modelUrl={modelUrl}
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
      />
    </div>
  );
};

export default Favorites;
