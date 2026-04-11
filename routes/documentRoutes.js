import express from 'express';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  analyzeDocument,
  uploadDocument,
  getDocumentHistory,
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateDocument } from '../middleware/validationMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getDocuments).post(validateDocument, createDocument);
router.post('/upload', uploadLimiter, upload, uploadDocument);
router.route('/:id').get(getDocumentById).put(validateDocument, updateDocument).delete(deleteDocument);
router.get('/:id/history', getDocumentHistory);
router.post('/:id/analyze', analyzeDocument);

export default router;
