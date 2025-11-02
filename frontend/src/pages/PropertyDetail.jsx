import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axios';
import Model3DViewer from '../components/Model3DViewer';
import ImageLightbox from '../components/ImageLightbox';
import MapView from '../components/MapView';
import FavoriteButton from '../components/FavoriteButton';
import PropertyCard from '../components/PropertyCard';
import SEOHead from '../components/SEOHead';
import toast from 'react-hot-toast';
import { MapPin, IndianRupee, Bed, Bath, Maximize, User, Mail, Phone, MessageSquare, Loader, Eye, Calendar } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const locationRouter = useLocation();
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProperty();
    fetchSimilarProperties();
  }, [id]);

  // Auto-open inquiry form if ?inquire=1 is present and not owner
  useEffect(() => {
    const params = new URLSearchParams(locationRouter.search);
    const shouldInquire = params.get('inquire') === '1';
    if (shouldInquire && property) {
      const ownerIdCheck = property?.owner?._id || property?.owner;
      const isOwnerCheck = !!(user && ownerIdCheck && ownerIdCheck.toString() === user?._id);
      if (!isOwnerCheck) {
        setShowInquiryForm(true);
      }
    }
  }, [locationRouter.search, property, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/properties/${id}`);
      setProperty(data);
    } catch (error) {
      toast.error('Failed to fetch property details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProperties = async () => {
    try {
      const { data } = await axios.get(`/properties/${id}/similar`);
      setSimilarProperties(data);
    } catch (error) {
      console.error('Failed to fetch similar properties:', error);
    }
  };

  const handleInquiryChange = (e) => {
    setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/inquiry', {
        ...inquiryData,
        propertyId: id
      });
      toast.success('Inquiry submitted successfully!');
      setShowInquiryForm(false);
      setInquiryData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit inquiry');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loader className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Property not found</p>
      </div>
    );
  }

  // Determine if current user is the owner (handles both populated and unpopulated owner)
  const ownerId = property?.owner?._id || property?.owner;
  const isOwner = !!(user && ownerId && ownerId.toString() === user._id);
  const isSeller = user?.role === 'seller';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <SEOHead
        title={`${property.title} - ${property.location} | HomeSphere View`}
        description={property.description}
        image={property.images[0]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Image/3D Viewer */}
        <div className="card overflow-hidden mb-6 relative">
          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton propertyId={property._id} size="large" />
          </div>

          {property.modelUrl ? (
            <Model3DViewer modelUrl={property.modelUrl} />
          ) : (
            <img
              src={property.images[selectedImage]}
              alt={property.title}
              onClick={() => setShowLightbox(true)}
              className="w-full h-[500px] object-cover cursor-pointer"
            />
          )}
          
          {/* Thumbnail Images */}
          <div className="flex gap-2 p-4 overflow-x-auto">
            {property.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title} ${index + 1}`}
                onClick={() => {
                  setSelectedImage(index);
                  setShowLightbox(true);
                }}
                className={`w-20 h-20 object-cover rounded cursor-pointer ${
                  selectedImage === index ? 'ring-2 ring-primary-600' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {showLightbox && (
          <ImageLightbox
            images={property.images}
            initialIndex={selectedImage}
            onClose={() => setShowLightbox(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Details */}
          <div className="lg:col-span-2 card p-6">
            <div className="mb-4">
              <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {property.propertyType}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{property.title}</h1>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{property.location}</span>
            </div>

            <div className="flex items-center text-primary-600 dark:text-primary-400 font-bold text-4xl mb-6">
              <IndianRupee className="w-8 h-8" />
              <span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(property.price)}</span>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              {property.bedrooms > 0 && (
                <div className="flex items-center space-x-2">
                  <Bed className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center space-x-2">
                  <Bath className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.area > 0 && (
                <div className="flex items-center space-x-2">
                  <Maximize className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                    <p className="font-semibold">{property.area} sqft</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{property.views} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Listed {new Date(property.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Map */}
            {(property.latitude && property.longitude) && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Location</h2>
                <MapView
                  latitude={property.latitude}
                  longitude={property.longitude}
                  title={property.title}
                  location={property.location}
                />
              </div>
            )}

            {/* Owner Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Listed by</h3>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{property.owner.name}</span>
              </div>
              {property.owner.phone && (
                <div className="flex items-center space-x-2 mt-2">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{property.owner.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Form + Contact */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{isOwner ? 'Your Property' : 'Interested?'}</h2>

              {isOwner ? (
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-900/30 rounded-lg p-3">
                  <p className="text-primary-700 dark:text-primary-300 text-center font-medium">This is your property listing</p>
                </div>
              ) : (!isSeller && !showInquiryForm) ? (
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full btn-primary bg-primary-600 hover:bg-primary-700 flex items-center justify-center space-x-2 py-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>I'm Interested</span>
                </button>
              ) : (!isSeller && (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={inquiryData.name}
                        onChange={handleInquiryChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={inquiryData.email}
                        onChange={handleInquiryChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        name="phone"
                        value={inquiryData.phone}
                        onChange={handleInquiryChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                    <textarea
                      name="message"
                      required
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                      placeholder="I'm interested in this property..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
                      {submitting ? 'Sending...' : 'Send'}
                    </button>
                    <button type="button" onClick={() => setShowInquiryForm(false)} className="flex-1 btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              ))}

              {/* Quick contact options for buyers */}
              {!isOwner && !isSeller && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact Seller</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {property.owner.phone && (
                      <a href={`tel:${property.owner.phone}`} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 transition-colors">
                        <Phone className="w-4 h-4" /> Call Seller
                      </a>
                    )}
                    {property.owner.email && (
                      <a
                        href={`mailto:${property.owner.email}?subject=${encodeURIComponent('Inquiry about ' + property.title)}&body=${encodeURIComponent('Hi, I am interested in your property: ' + property.title + ' at ' + property.location + '.')}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 transition-colors"
                      >
                        <Mail className="w-4 h-4" /> Email Seller
                      </a>
                    )}
                    {property.owner.phone && (
                      <a
                        href={`https://wa.me/${String(property.owner.phone).replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hi! I am interested in your property: ' + property.title + ' in ' + property.location + '. Is it available for a visit?')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-300 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
