import Property from '../models/Property.js';
import mongoose from 'mongoose';
import { Readable } from 'stream';

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

    // Get uploaded image URLs from Cloudinary (multer-storage-cloudinary provides .path URL)
    // Using uploadImages.fields() - req.files is an object with field names as keys
    let images = [];
    if (req.files && req.files['images']) {
      images = req.files['images'].map(file => file.path);
    }
    
    // Handle 3D model - store to Mongo GridFS
    let modelUrl = null;
    if (req.file && req.file.fieldname === 'model') {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'models' });
      const filename = req.file.originalname || `model_${Date.now()}.glb`;
      const contentType = req.file.mimetype || 'application/octet-stream';
      const uploadStream = bucket.openUploadStream(filename, { contentType });
      const readable = Readable.from(req.file.buffer);
      await new Promise((resolve, reject) => {
        readable.pipe(uploadStream)
          .on('error', reject)
          .on('finish', resolve);
      });
      const fileId = uploadStream.id.toString();
      modelUrl = `/api/properties/model/${fileId}`;
      console.log(`Model stored in GridFS: ${fileId}`);
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
    return res.status(201).json(property);
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

    // Handle new images (Cloudinary URLs already in file.path)
    if (req.files && req.files['newImages']) {
      const newImageUrls = req.files['newImages'].map(file => file.path);
      property.images = [...property.images, ...newImageUrls];
    }

    // Handle model deletion
    if (deleteModel === 'true') {
      property.modelUrl = null;
    }

    // Handle new model via GridFS
    if (req.file && req.file.fieldname === 'newModel') {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'models' });
      const filename = req.file.originalname || `model_${Date.now()}.glb`;
      const contentType = req.file.mimetype || 'application/octet-stream';
      const uploadStream = bucket.openUploadStream(filename, { contentType });
      const readable = Readable.from(req.file.buffer);
      await new Promise((resolve, reject) => {
        readable.pipe(uploadStream)
          .on('error', reject)
          .on('finish', resolve);
      });
      const fileId = uploadStream.id.toString();
      property.modelUrl = `/api/properties/model/${fileId}`;
      console.log(`New model uploaded to GridFS: ${fileId}`);
    }

    await property.save();
    res.json(property);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getModelFile = async (req, res) => {
  try {
    const { id } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'models' });
    const _id = new mongoose.Types.ObjectId(id);
    // Try to find file to get contentType
    const files = await mongoose.connection.db.collection('models.files').find({ _id }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }
    const file = files[0];
    if (file.contentType) {
      res.set('Content-Type', file.contentType);
    }
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.on('error', (err) => {
      console.error('GridFS download error:', err);
      res.status(500).end();
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error('getModelFile error:', err);
    res.status(500).json({ message: err.message });
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

    // Allow delete if admin or owner
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) {
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

// @desc    Seed 6 demo properties for current user
// @route   POST /api/properties/my/seed
// @access  Private (Seller/Admin)
export const seedMyProperties = async (req, res) => {
  try {
    // Type-specific image pools for variety and relevance
    const pools = {
      villa: [
        'https://images.unsplash.com/photo-1597047084897-51e81819a499?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1613977257593-9c0120ff9d2f?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&h=800&fit=crop'
      ],
      apartment: [
        'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1499955085172-a104c9463ece?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=800&fit=crop'
      ],
      house: [
        'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d53?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1560185008-b033106af195?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb4caa6c8e0e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600585154154-1e47e6a6fcb9?w=1200&h=800&fit=crop'
      ],
      condo: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=800&fit=crop'
      ],
      commercial: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1461713086041-1c3cf1d45084?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200&h=800&fit=crop'
      ],
      land: [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-988cbb503d1b?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1200&h=800&fit=crop'
      ]
    };

    const demoModels = [
      'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079555/apartnemt2_ueinwq.glb',
      'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/house2_o3dvos.glb',
      'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/house_1_mrvbpf.glb',
      'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/vilal_2_ss2zg3.glb',
      'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/villa1_xuzoha.glb',
      'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/Apartment_hjf7bn.glb'
    ];

    const propertiesSeed = [
      // Villas (varied pricing)
      {
        title: 'Contemporary Villa with Pool - I',
        description: 'Elegant 5BHK villa with private pool, landscaped garden, and premium clubhouse access.',
        price: 32000000,
        location: 'Whitefield, Bengaluru, Karnataka',
        bedrooms: 5,
        bathrooms: 5,
        area: 4100,
        propertyType: 'villa'
      },
      {
        title: 'Contemporary Villa with Pool - II',
        description: 'Stunning 5BHK villa featuring home automation, deck sit-out, and double-height living.',
        price: 38000000,
        location: 'Whitefield, Bengaluru, Karnataka',
        bedrooms: 5,
        bathrooms: 5,
        area: 4200,
        propertyType: 'villa'
      },
      {
        title: 'Contemporary Villa with Pool - III',
        description: 'Premium 5BHK villa with private courtyard, sky lounge, and spa room.',
        price: 45000000,
        location: 'Whitefield, Bengaluru, Karnataka',
        bedrooms: 5,
        bathrooms: 6,
        area: 4500,
        propertyType: 'villa'
      },
      // Apartment
      {
        title: 'Luxury Sea-Facing Apartment',
        description: 'Premium 3BHK apartment with Arabian Sea views and modern amenities.',
        price: 27000000,
        location: 'Bandra West, Mumbai, Maharashtra',
        bedrooms: 3,
        bathrooms: 3,
        area: 1650,
        propertyType: 'apartment'
      },
      // Condo
      {
        title: 'Skyline View Condo',
        description: 'High-rise condo with skyline views, concierge, and rooftop lounge.',
        price: 22000000,
        location: 'Hiranandani Gardens, Powai, Mumbai',
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        propertyType: 'condo'
      },
      // Commercial
      {
        title: 'Grade-A Office Space',
        description: 'Premium commercial office space with plug-and-play fitouts and ample parking.',
        price: 60000000,
        location: 'DLF Cybercity, Gurgaon, Haryana',
        bedrooms: 0,
        bathrooms: 2,
        area: 6000,
        propertyType: 'commercial'
      },
      // Land
      {
        title: 'Prime Residential Land Plot',
        description: 'East-facing corner plot in a gated layout with 12m wide road access.',
        price: 15000000,
        location: 'Narsingi, Hyderabad, Telangana',
        bedrooms: 0,
        bathrooms: 0,
        area: 3600,
        propertyType: 'land'
      }
    ];

    // Create up to 6 diverse properties for current user (avoid same type repetition)
    const typeSeen = new Set();
    const diverse = [];
    for (const item of propertiesSeed) {
      if (!typeSeen.has(item.propertyType)) {
        typeSeen.add(item.propertyType);
        diverse.push(item);
      }
      if (diverse.length >= 6) break;
    }
    while (diverse.length < 6) {
      diverse.push(propertiesSeed[diverse.length % propertiesSeed.length]);
    }

    // Prepare docs with randomized, type-relevant images
    const nowSeed = Date.now() % 7;
    const docsToCreate = await Promise.all(
      diverse.map(async (p, idx) => {
        const pool = pools[p.propertyType] || pools.house;
        const base = (idx * 2 + nowSeed) % pool.length;
        const images = [
          pool[base % pool.length],
          pool[(base + 1) % pool.length],
          pool[(base + 2) % pool.length],
          pool[(base + 3) % pool.length],
        ];

        // Ensure unique title across DB by suffixing if needed
        let title = p.title;
        const exists = await Property.exists({ title });
        if (exists) {
          title = `${p.title} – ${new Date().getTime().toString().slice(-4)}`;
        }

        return {
          ...p,
          title,
          images,
          modelUrl: demoModels[idx % demoModels.length],
          owner: req.user._id,
          featured: idx < 6
        };
      })
    );

    const created = await Property.insertMany(docsToCreate);

    // Return updated list
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
