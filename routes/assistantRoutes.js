import express from 'express';
import { speakText, speakDocument } from '../controllers/assistantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.post('/speak', speakText);
router.post('/documents/:id/speak', speakDocument);

export default router;
