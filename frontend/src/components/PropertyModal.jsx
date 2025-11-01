import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Bed, Bath, Maximize, Check, Package, Play } from 'lucide-react';
import Model3DModal from './Model3DModal';
import { AuthContext } from '../context/AuthContext';

const PropertyModal = ({ property, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'images'
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!isOpen || !property) return null;

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  const features = [
    'Ocean View',
    'Private Beach', 
    'Gourmet Kitchen',
    'Infinity Pool',
    'Smart Home',
    'Wine Cellar'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {formatPrice(property.price)}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'images'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Images
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' ? (
            <>
              {/* Property Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center text-blue-600">
                  <Bed className="w-5 h-5 mr-2" />
                  <span className="font-medium">{property.bedrooms || 5} Bedrooms</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Bath className="w-5 h-5 mr-2" />
                  <span className="font-medium">{property.bathrooms || 4} Bathrooms</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Maximize className="w-5 h-5 mr-2" />
                  <span className="font-medium">{property.area || 4200} sqft</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description || 
                    'Breathtaking oceanfront estate with panoramic Pacific views. Features include infinity pool, private beach access, and state-of-the-art smart home technology.'}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Preview */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3D Preview</h3>
                <p className="text-gray-600 mb-4">Interactive 3D model viewer coming soon!</p>
                {property.modelUrl && (
                  <button
                    onClick={() => setIs3DModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Launch 3D Tour
                  </button>
                )}
                <div className="text-sm text-gray-500 mt-2">
                  Powered by Cloudinary
                </div>
              </div>
            </>
          ) : (
            /* Image Gallery */
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{property.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Show multiple images or repeat the same image */}
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop'}
                      alt={`${property.title} - Image ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Price and Location in Images Tab */}
              <div className="mt-6 pt-4 border-t">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          {/* Hide Interested for sellers and owners */}
          {(() => {
            const ownerId = property?.owner?._id || property?.owner;
            const isOwner = !!(user && ownerId && ownerId.toString() === user._id);
            const isSeller = user?.role === 'seller';
            if (isOwner || isSeller) return null;
            return (
              <button
                onClick={() => {
                  navigate(`/properties/${property._id}?inquire=1`);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                I'm Interested
              </button>
            );
          })()}
          <button
            onClick={() => {
              navigate(`/properties/${property._id}`);
              onClose();
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* 3D Model Modal */}
      <Model3DModal
        modelUrl={property?.modelUrl}
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </div>
  );
};

export default PropertyModal;
