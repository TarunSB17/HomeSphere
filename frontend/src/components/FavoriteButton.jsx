import { useState, useEffect, useContext } from 'react';
import { Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ propertyId, size = 'default' }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'buyer') {
      checkFavorite();
    }
  }, [propertyId, user]);

  const checkFavorite = async () => {
    try {
      const { data } = await axios.get(`/favorites/check/${propertyId}`);
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    if (user.role !== 'buyer') {
      toast.error('Only buyers can save favorites');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        await axios.delete(`/favorites/${propertyId}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await axios.post(`/favorites/${propertyId}`);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'buyer') {
    return null;
  }

  const iconSize = size === 'large' ? 'w-8 h-8' : 'w-6 h-6';
  const buttonSize = size === 'large' ? 'p-3' : 'p-2';

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${buttonSize} rounded-full bg-white shadow-md hover:shadow-lg transition-all disabled:opacity-50`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${iconSize} ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
        } transition-colors`}
      />
    </button>
  );
};

export default FavoriteButton;
