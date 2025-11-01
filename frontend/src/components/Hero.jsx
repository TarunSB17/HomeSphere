import { motion } from 'framer-motion';
import { Search, Home, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background-light via-primary-50 to-accent-50 dark:from-background-dark dark:via-accent-900 dark:to-primary-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-gradient-primary text-white text-sm font-medium shadow-lg">
                Premium Real Estate Marketplace
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-accent-900 dark:text-white mb-6 leading-tight">
              Find Your{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Dream Home
              </span>
              {' '}in 3D
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Experience properties like never before with our immersive 3D viewing technology. 
              Browse, explore, and visualize your perfect home from anywhere in the world.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 rounded-2xl p-2 shadow-glass-lg mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 py-3 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search location, property type..."
                    className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
                  />
                </div>
                <Link
                  to="/properties"
                  className="px-8 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
                >
                  Search
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6"
            >
              <div>
                <div className="text-3xl font-bold text-accent-900 dark:text-white mb-1">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Properties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-900 dark:text-white mb-1">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-900 dark:text-white mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cities</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Preview / Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Glass Card with Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Home, title: '3D Virtual Tours', desc: 'Explore properties in immersive 3D' },
                { icon: TrendingUp, title: 'Market Insights', desc: 'Real-time pricing analytics' },
                { icon: Shield, title: 'Verified Listings', desc: 'All properties are verified' },
                { icon: Search, title: 'Smart Search', desc: 'AI-powered recommendations' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 shadow-glass hover:shadow-glass-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-accent-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Floating 3D House Icon */}
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-full rounded-3xl bg-gradient-primary flex items-center justify-center shadow-2xl">
                <Home className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-accent-500 flex justify-center pt-2">
          <div className="w-1 h-3 bg-accent-500 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
