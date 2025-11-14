import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getSimilarProperties,
  seedMyProperties,
  getModelFile
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, canList } from '../middleware/roleMiddleware.js';
import { uploadImages, uploadModelMemory } from '../config/cloudinary.js';

const router = express.Router();

// Public routes (order matters: specific before dynamic)
router.get('/', getProperties);
router.get('/model/:id', getModelFile);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getSimilarProperties);

// Protected routes
router.post(
  '/',
  protect,
  canList,
  uploadImages.fields([{ name: 'images', maxCount: 10 }]),
  uploadModelMemory.single('model'),
  createProperty
);

router.post('/my/seed', protect, canList, seedMyProperties);
router.get('/my/listings', protect, getMyProperties);
router.put(
  '/:id',
  protect,
  canList,
  uploadImages.fields([{ name: 'newImages', maxCount: 10 }]),
  uploadModelMemory.single('newModel'),
  updateProperty
);
router.delete('/:id', protect, deleteProperty);

export default router;
