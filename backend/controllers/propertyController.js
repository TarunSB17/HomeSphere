import Property from '../models/Property.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, propertyType, location, sort } = req.query;
    
    let query = {};

    // Search by title, description, or location
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Sort options
    let sortOption = {};
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .sort(sortOption);

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');

    if (property) {
      // Increment view count
      property.views += 1;
      await property.save();

      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res) => {
  try {
    console.log('----- CREATE PROPERTY START -----');
    console.log('[user]', req.user?._id?.toString(), req.user?.email, 'role:', req.user?.role);
    console.log('[body.keys]', Object.keys(req.body));
    if (req.files) {
      if (Array.isArray(req.files)) {
        console.log(`[files] array length: ${req.files.length}`);
      } else {
        const keys = Object.keys(req.files);
        console.log(`[files] fields: ${keys.join(', ')}`);
        keys.forEach((k) => {
          const arr = req.files[k] || [];
          console.log(`  - field ${k}: ${arr.length} file(s)`);
          arr.slice(0, 5).forEach((f, idx) => {
            console.log(`    • [${k}#${idx}] name=${f.originalname} mime=${f.mimetype} size=${f.size} path=${f.path} public_id=${f.filename}`);
          });
        });
      }
    } else {
      console.log('[files] NONE');
    }
    if (req.file) {
      console.log(`[single file] field=${req.file.fieldname} name=${req.file.originalname} mime=${req.file.mimetype} size=${req.file.size} path=${req.file.path} public_id=${req.file.filename}`);
    }

    const { title, description, price, location, bedrooms, bathrooms, area, propertyType } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, price, location' 
      });
    }

    // Get uploaded image URLs from local storage
    // Using uploadImages.fields() - req.files is an object with field names as keys
    let images = [];
    if (req.files && req.files['images']) {
      // Convert local file paths to URLs
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      images = req.files['images'].map(file => {
        // file.path is like: backend/uploads/images/img-123.jpg
        // Convert to: /uploads/images/img-123.jpg
        const relativePath = file.path.replace(/\\/g, '/').split('uploads/')[1];
        return `${baseUrl}/uploads/${relativePath}`;
      });
    }
    
    // Handle 3D model - store on disk like images
    let modelUrl = null;
    if (req.files && req.files['model'] && req.files['model'][0]) {
      const file = req.files['model'][0];
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      // file.path is like: backend/uploads/models/model-123.glb
      const relativePath = file.path.replace(/\\/g, '/').split('uploads/')[1];
      modelUrl = `${baseUrl}/uploads/${relativePath}`;
      console.log(`Model stored at: ${modelUrl}`);
    }

    if (images.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    console.log('Creating property with data:', {
      title,
      descriptionLen: (description || '').length,
      price,
      location,
      imageCount: images.length,
      hasModel: !!modelUrl
    });
    console.log('Image URLs:', images);
    if (modelUrl) console.log('Model URL:', modelUrl);

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      location,
      images,
      modelUrl,
      owner: req.user._id,
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      area: area ? Number(area) : 0,
      propertyType: propertyType || 'house'
    });

    console.log('Property created successfully:', property._id, 'images:', property.images?.length, 'hasModel:', !!property.modelUrl);
    console.log('----- CREATE PROPERTY END -----');
  } catch (error) {
    console.error('Create property error:', error?.message);
    if (error?.stack) console.error(error.stack);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update basic fields
    const { title, description, price, location, bedrooms, bathrooms, area, propertyType, status, imagesToDelete, deleteModel } = req.body;
    
    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = Number(price);
    if (location) property.location = location;
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
    if (area !== undefined) property.area = Number(area);
    if (propertyType) property.propertyType = propertyType;
    if (status) property.status = status;

    // Handle image deletion
    if (imagesToDelete) {
      const toDelete = JSON.parse(imagesToDelete);
      property.images = property.images.filter(img => !toDelete.includes(img));
    }

    // Handle new images
    if (req.files && req.files['newImages']) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const newImageUrls = req.files['newImages'].map(file => {
        const relativePath = file.path.replace(/\\/g, '/').split('uploads/')[1];
        return `${baseUrl}/uploads/${relativePath}`;
      });
      property.images = [...property.images, ...newImageUrls];
    }

    // Handle model deletion
    if (deleteModel === 'true') {
      property.modelUrl = null;
    }

    // Handle new model - store on disk
    if (req.files && req.files['newModel'] && req.files['newModel'][0]) {
      const file = req.files['newModel'][0];
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const relativePath = file.path.replace(/\\/g, '/').split('uploads/')[1];
      property.modelUrl = `${baseUrl}/uploads/${relativePath}`;
      
      console.log(`New model uploaded: ${property.modelUrl}`);
    }

    await property.save();
    res.json(property);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get similar/recommended properties
// @route   GET /api/properties/:id/similar
// @access  Public
export const getSimilarProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find similar properties based on property type and price range
    const similarProperties = await Property.find({
      _id: { $ne: req.params.id },
      propertyType: property.propertyType,
      price: {
        $gte: property.price * 0.8,
        $lte: property.price * 1.2
      }
    })
      .populate('owner', 'name email phone')
      .limit(4);

    res.json(similarProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's properties
// @route   GET /api/properties/my/listings
// @access  Private
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
