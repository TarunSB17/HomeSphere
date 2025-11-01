import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { Loader, Trash2, Eye, PlusCircle } from 'lucide-react';
import PropertyManagementModal from '../components/PropertyManagementModal';

const MyProperties = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyProperties();
  }, [user, navigate]);

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

  const handleUpdateProperty = (updatedProperty) => {
    setProperties(properties.map(p => 
      p._id === updatedProperty._id ? updatedProperty : p
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Properties</h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>
          <Link
            to="/add-property"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add New Property</span>
          </Link>
        </div>

        {/* Properties */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium capitalize mb-2">
                          {property.propertyType}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {property.title}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'sold'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <p className="text-primary-600 font-bold text-2xl mb-4">
                      ${property.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-sm text-gray-500">
                        <p>Listed on: {new Date(property.createdAt).toLocaleDateString()}</p>
                        <p className="mt-1">Location: {property.location}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProperty(property)}
                          className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View & Edit</span>
                        </button>
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
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-4">You haven't added any properties yet.</p>
            <Link
              to="/add-property"
              className="inline-flex items-center space-x-2 btn-primary"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Your First Property</span>
            </Link>
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
    </div>
  );
};

export default MyProperties;
