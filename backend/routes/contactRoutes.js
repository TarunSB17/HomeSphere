import express from 'express';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

// Mounted at /api/contact in server.js
router.post('/', submitContact);

export default router;
