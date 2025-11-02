import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import PropertyManagementModal from '../components/PropertyManagementModal';
import Model3DModal from '../components/Model3DModal';
import SearchFilter from '../components/SearchFilter';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PropertyList = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [is3DOpen, setIs3DOpen] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProperties = async (searchTerm = '', filterParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterParams.minPrice) params.append('minPrice', filterParams.minPrice);
      if (filterParams.maxPrice) params.append('maxPrice', filterParams.maxPrice);
      if (filterParams.propertyType) params.append('propertyType', filterParams.propertyType);
      if (filterParams.location) params.append('location', filterParams.location);
      if (filterParams.sort) params.append('sort', filterParams.sort);

      const { data } = await axios.get(`/properties?${params.toString()}`);
      setProperties(data);
    } catch (error) {
      toast.error('Failed to fetch properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsManageOpen(true);
  };

  const handleUpdated = (updated) => {
    setProperties((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setIsManageOpen(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    fetchProperties(q, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSearch = (searchTerm) => {
    fetchProperties(searchTerm, filters);
  };

  const handleFilter = (filterParams) => {
    setFilters(filterParams);
    fetchProperties('', filterParams);
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleView3D = (property) => {
    if (!property?.modelUrl) return;
    setModelUrl(property.modelUrl);
    setIs3DOpen(true);
  };

  const handleDelete = async (property) => {
    const ok = window.confirm(`Delete "${property.title}"? This action cannot be undone.`);
    if (!ok) return;
    try {
      await axios.delete(`/properties/${property._id}`);
      toast.success('Property deleted');
      fetchProperties('', filters);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Discover Your Dream Property</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse through our exclusive collection of properties with 3D views</p>
        </div>

        {/* Search and Filter */}
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 text-primary-500 animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onViewDetails={handleViewDetails}
                onView3D={handleView3D}
                onDelete={user?.role === 'admin' ? handleDelete : undefined}
                onEdit={user?.role === 'admin' ? handleEdit : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No properties found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* 3D Modal */}
      <Model3DModal
        modelUrl={modelUrl}
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
      />

      {/* Admin Edit Modal */}
      {user?.role === 'admin' && (
        <PropertyManagementModal
          property={selectedProperty}
          isOpen={isManageOpen}
          onClose={() => setIsManageOpen(false)}
          onUpdate={handleUpdated}
        />
      )}
    </div>
  );
};

export default PropertyList;
