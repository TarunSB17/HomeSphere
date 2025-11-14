import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { Loader, Trash2, Eye, PlusCircle, Box } from 'lucide-react';
import PropertyManagementModal from '../components/PropertyManagementModal';
import Model3DModal from '../components/Model3DModal';

const MyProperties = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [is3DOpen, setIs3DOpen] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyProperties();
    // re-fetch when query changes (e.g., after adding property with ?refresh=1)
  }, [user, navigate, location.search]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/properties/my/listings');
      setProperties(data);
    } catch (error) {
      toast.error('Failed to fetch your properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axios.delete(`/properties/${id}`);
      toast.success('Property deleted successfully');
      setProperties(properties.filter(p => p._id !== id));
    } catch (error) {
      toast.error('Failed to delete property');
      console.error(error);
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleView3D = (property) => {
    if (!property?.modelUrl) return;
    setModelUrl(property.modelUrl);
    setIs3DOpen(true);
  };

  const handleUpdateProperty = (updatedProperty) => {
    setProperties(properties.map(p => 
      p._id === updatedProperty._id ? updatedProperty : p
    ));
  };

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      const { data } = await axios.post('/properties/my/seed');
      setProperties(data);
      toast.success('Added 6 demo properties');
    } catch (error) {
      toast.error('Failed to add demo properties');
      console.error(error);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loader className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Properties</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your property listings</p>
          </div>
          <div className="flex gap-2">
            {(user?.role === 'seller' || user?.role === 'admin') && (
              <button
                onClick={handleSeedDemo}
                disabled={seeding}
                className="btn-secondary"
              >
                {seeding ? 'Generating...' : 'Generate 6 Demo Listings'}
              </button>
            )}
            <Link
              to="/add-property"
              className="btn-primary flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add New Property</span>
            </Link>
          </div>
        </div>

        {/* Properties */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="card overflow-hidden transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass focus-within:ring-2 focus-within:ring-primary-500/20"
              >
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/3">
                    {(() => {
                      const fallbackByType = {
                        villa: 'https://images.unsplash.com/photo-1613977257593-9c0120ff9d2f?w=1200&h=800&fit=crop',
                        apartment: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=800&fit=crop',
                        condo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
                        commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
                        land: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop',
                        house: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d53?w=1200&h=800&fit=crop',
                      };
                      const cover = (property.images || []).find(Boolean) || fallbackByType[property.propertyType] || fallbackByType.house;
                      return (
                        <img
                          src={cover}
                          alt={property.title}
                          className="w-full h-64 md:h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = fallbackByType[property.propertyType] || fallbackByType.house;
                          }}
                        />
                      );
                    })()}
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium capitalize mb-2">
                          {property.propertyType}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {property.title}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.status === 'available'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : property.status === 'sold'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {property.status}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <p className="text-primary-600 dark:text-primary-400 font-bold text-2xl mb-4">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price)}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Listed on: {new Date(property.createdAt).toLocaleDateString('en-IN')}</p>
                        <p className="mt-1">Location: {property.location}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProperty(property)}
                          className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View & Edit</span>
                        </button>
                        {property.modelUrl && (
                          <button
                            onClick={() => handleView3D(property)}
                            className="flex items-center space-x-1 bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
                          >
                            <Box className="w-4 h-4" />
                            <span>View 3D</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card space-y-4">
            <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't added any properties yet.</p>
            <div className="flex justify-center gap-3">
              {(user?.role === 'seller' || user?.role === 'admin') && (
                <button onClick={handleSeedDemo} disabled={seeding} className="btn-secondary">
                  {seeding ? 'Generating...' : 'Generate 6 Demo Listings'}
                </button>
              )}
              <Link
                to="/add-property"
                className="inline-flex items-center space-x-2 btn-primary"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add Your First Property</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Property Management Modal */}
      <PropertyManagementModal
        property={selectedProperty}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={handleUpdateProperty}
      />

      {/* 3D Viewer Modal */}
      <Model3DModal
        modelUrl={modelUrl}
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
      />
    </div>
  );
};

export default MyProperties;
