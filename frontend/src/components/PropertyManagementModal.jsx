import { useState, useEffect } from 'react';
import { X, Edit2, Users, DollarSign, MapPin, Save, Loader, Upload, Trash2 } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const PropertyManagementModal = ({ property, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'inquiries', 'edit'
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'house',
    status: 'available'
  });
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newModel, setNewModel] = useState(null);
  const [deleteModel, setDeleteModel] = useState(false);

  useEffect(() => {
    if (property && isOpen) {
      setEditData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        location: property.location || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        propertyType: property.propertyType || 'house',
        status: property.status || 'available'
      });
      if (activeTab === 'inquiries') {
        fetchInquiries();
      }
    }
  }, [property, isOpen, activeTab]);

  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const { data } = await axios.get(`/inquiry/property/${property._id}`);
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = (imageUrl) => {
    setImagesToDelete([...imagesToDelete, imageUrl]);
  };

  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewModel(file);
      setDeleteModel(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      
      // Append text fields
      Object.keys(editData).forEach(key => {
        formData.append(key, editData[key]);
      });

      // Append new images
      newImages.forEach(image => {
        formData.append('newImages', image);
      });

      // Append images to delete
      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      // Append new model
      if (newModel) {
        formData.append('newModel', newModel);
      }

      // Mark model for deletion
      if (deleteModel) {
        formData.append('deleteModel', 'true');
      }

      const { data } = await axios.put(`/properties/${property._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Property updated successfully!');
      onUpdate(data);
      setEditing(false);
      setNewImages([]);
      setImagesToDelete([]);
      setNewModel(null);
      setDeleteModel(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
            <p className="text-gray-600">{property.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 font-medium transition ${
              activeTab === 'details'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-3 font-medium transition relative ${
              activeTab === 'inquiries'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            Interested Buyers
            {inquiries.length > 0 && (
              <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
                {inquiries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('edit');
              setEditing(true);
            }}
            className={`px-4 py-3 font-medium transition ${
              activeTab === 'edit'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Edit2 className="w-4 h-4 inline mr-1" />
            Edit
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div>
              {/* Property Image */}
              <div className="mb-6">
                <img
                  src={property.images?.[0] || '/placeholder.jpg'}
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-xl font-bold text-primary-600">${property.price.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-xl font-bold">{property.bedrooms || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="text-xl font-bold">{property.bathrooms || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="text-xl font-bold">{property.area || 'N/A'} sqft</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Status Badge */}
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  property.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'sold'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Status: {property.status}
                </span>
              </div>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">People Interested in This Property</h3>
              {loadingInquiries ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry._id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{inquiry.name}</h4>
                          <p className="text-sm text-gray-600">{inquiry.email}</p>
                          {inquiry.phone && (
                            <p className="text-sm text-gray-600">{inquiry.phone}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                        <p className="text-gray-600">{inquiry.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No inquiries yet for this property</p>
                </div>
              )}
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === 'edit' && (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  rows="5"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editData.location}
                    onChange={handleEditChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={editData.bedrooms}
                    onChange={handleEditChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={editData.bathrooms}
                    onChange={handleEditChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                  <input
                    type="number"
                    name="area"
                    value={editData.area}
                    onChange={handleEditChange}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Image Management */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Images</h3>
                
                {/* Existing Images */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                  <div className="grid grid-cols-3 gap-3">
                    {property.images?.filter(img => !imagesToDelete.includes(img)).map((image, idx) => (
                      <div key={idx} className="relative group">
                        <img src={image} alt={`Property ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingImage(image)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New Images to Upload */}
                {newImages.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Images (will be uploaded)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {newImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={URL.createObjectURL(img)} alt={`New ${idx + 1}`} className="w-full h-24 object-cover rounded border-2 border-green-500" />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Upload className="w-4 h-4" />
                  <span>Add Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Model Management */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3D Model</h3>
                
                {/* Current Model */}
                {property.modelUrl && !deleteModel && !newModel && (
                  <div className="mb-4 bg-gray-50 p-3 rounded flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Current Model</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{property.modelUrl}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteModel(true)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* New Model */}
                {newModel && (
                  <div className="mb-4 bg-green-50 border-2 border-green-500 p-3 rounded flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-green-700">New Model (will be uploaded)</p>
                      <p className="text-xs text-gray-600">{newModel.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewModel(null)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Model Deleted Message */}
                {deleteModel && !newModel && (
                  <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded">
                    <p className="text-sm text-red-700">Model will be deleted on save</p>
                  </div>
                )}

                {/* Upload Model */}
                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Upload className="w-4 h-4" />
                  <span>{property.modelUrl || newModel ? 'Replace Model' : 'Upload Model'}</span>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleModelUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={editData.propertyType}
                    onChange={handleEditChange}
                    className="input-field"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    className="input-field"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setActiveTab('details');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyManagementModal;
