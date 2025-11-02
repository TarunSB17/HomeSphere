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
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);
    } catch {
      return `₹${(price || 0).toLocaleString('en-IN')}`;
    }
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {formatPrice(property.price)}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 transition-colors">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'images'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {property.description ||
                    'Breathtaking oceanfront estate with panoramic views. Features include infinity pool, private beach access, and smart home technology throughout.'}
                </p>
                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  Additional highlights include premium fittings, dedicated parking, 24x7 security, and proximity to top schools, hospitals, and entertainment hubs.
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center transition-colors">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">3D Preview</h3>
                {property.modelUrl && (
                  <button
                    onClick={() => setIs3DModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Launch 3D Tour
                  </button>
                )}
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Powered by Cloudinary
                </div>
              </div>
            </>
          ) : (
            /* Image Gallery */
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{property.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  const fallbacksByType = {
                    villa: [
                      'https://images.unsplash.com/photo-1613977257593-9c0120ff9d2f?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
                    ],
                    apartment: [
                      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1499955085172-a104c9463ece?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop',
                    ],
                    condo: [
                      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&h=600&fit=crop',
                    ],
                    commercial: [
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1461713086041-1c3cf1d45084?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&h=600&fit=crop',
                    ],
                    land: [
                      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1521334726092-b509a19597a8?w=800&h=600&fit=crop',
                    ],
                    house: [
                      'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d53?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1560448075-bb4caa6c8e0e?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1600585154154-1e47e6a6fcb9?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1560185008-b033106af195?w=800&h=600&fit=crop',
                    ],
                  };
                  const type = (property.propertyType || 'house').toString().toLowerCase();
                  const pool = fallbacksByType[type] || fallbacksByType.house;
                  const valid = (property.images || []).filter(Boolean);
                  const need = 4 - valid.length;
                  const fill = Array.from({ length: Math.max(need, 0) }, (_, i) => pool[i % pool.length]);
                  return [...valid.slice(0, 4), ...fill].slice(0, 4);
                })().map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={typeof img === 'string' ? img : ''}
                      alt={`${property.title} - Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Price and Location in Images Tab */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
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
