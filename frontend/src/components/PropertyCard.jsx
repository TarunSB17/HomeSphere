import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize, Box } from 'lucide-react';
import { useState } from 'react';
import FavoriteButton from './FavoriteButton';

const PropertyCard = ({ property, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Favorite state handled by FavoriteButton component

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-lg transition-all duration-300 border border-white/20 dark:border-gray-700/20"
    >
      {/* Image with Price Badge and Overlay */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={property.images?.[0] || '/api/placeholder/400/300'}
          alt={property.title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

        {/* Price Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-gradient-primary text-white font-bold text-sm shadow-lg backdrop-blur-sm"
        >
          {formatPrice(property.price)}
        </motion.div>

        {/* Favorite Button (buyers only) */}
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton propertyId={property._id} />
        </div>

        {/* 3D Badge */}
        {property.modelUrl && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-accent-500 text-white text-xs font-semibold flex items-center space-x-1 shadow-lg"
          >
            <Box className="w-3 h-3" />
            <span>3D Available</span>
          </motion.div>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg backdrop-blur-sm bg-white/20 text-white text-xs font-medium capitalize">
          {property.status || 'Available'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-accent-900 dark:text-white mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-primary-500" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-sm mb-5">
          <div className="flex items-center space-x-1.5">
            <Bed className="w-4 h-4 text-primary-500" />
            <span>{property.bedrooms || 3}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Bath className="w-4 h-4 text-primary-500" />
            <span>{property.bathrooms || 2}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Maximize className="w-4 h-4 text-primary-500" />
            <span>{property.area || 2500} sqft</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => onViewDetails(property)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 px-4 bg-gradient-primary text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            View Details
          </motion.button>

          {property.modelUrl && (
            <motion.button
              onClick={() => onViewDetails(property)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-3 px-4 bg-accent-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">View 3D</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
