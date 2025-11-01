import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp } from 'lucide-react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import axios from '../utils/axios';

const Landing = () => {
  const [featured, setFeatured] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Demo properties matching your screenshot
  const demoProperties = [
    {
      _id: 'demo1',
      title: 'Modern Downtown Loft',
      location: 'Manhattan, New York',
      price: 1250000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1500,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&h=300&fit=crop'
      ],
      description: 'Stunning modern loft in the heart of Manhattan with floor-to-ceiling windows and city views.',
      modelUrl: 'https://res.cloudinary.com/demo/raw/upload/sample_3d_model.glb'
    },
    {
      _id: 'demo2',
      title: 'Luxury Beachfront Villa',
      location: 'Malibu, California',
      price: 5500000,
      bedrooms: 5,
      bathrooms: 4,
      area: 4200,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500&h=300&fit=crop'
      ],
      description: 'Breathtaking oceanfront estate with panoramic Pacific views. Features include infinity pool, private beach access, and state-of-the-art smart home technology.',
      modelUrl: 'https://res.cloudinary.com/demo/raw/upload/villa_3d_model.glb'
    },
    {
      _id: 'demo3',
      title: 'Contemporary Mountain Retreat',
      location: 'Aspen, Colorado',
      price: 3200000,
      bedrooms: 4,
      bathrooms: 3,
      area: 3500,
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'
      ],
      description: 'Architectural masterpiece nestled in the Rocky Mountains with panoramic views and luxury amenities.',
      modelUrl: 'https://res.cloudinary.com/demo/raw/upload/mountain_house_3d.glb'
    }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/properties');
        if (Array.isArray(data) && data.length > 0) {
          setFeatured(data.slice(0, 6));
        } else {
          // Use demo data if no properties from API
          setFeatured(demoProperties);
        }
      } catch (e) {
        // Use demo data on error
        setFeatured(demoProperties);
      }
    };
    load();
  }, []);

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Properties Section */}
      <section className="relative py-20 bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{featured.length} Properties Available</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent-900 dark:text-white mb-4">
              Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Properties</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties with immersive 3D tours
            </p>
          </motion.div>

          {/* Properties Grid */}
          {featured.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featured.map((p, index) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PropertyCard property={p} onViewDetails={handleViewDetails} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 rounded-2xl p-12 max-w-md mx-auto shadow-glass">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-2">
                  No Properties Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back soon for amazing properties
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Landing;
