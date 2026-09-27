import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import upload from '../config/multer.js';
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  getMyCases
} from '../controllers/caseController.js';

const router = express.Router();

// Validation rules
const createCaseValidation = [
  body('title').trim().isLength({ min: 10, max: 255 }).withMessage('Le titre doit contenir entre 10 et 255 caractères'),
  body('description').trim().isLength({ min: 50 }).withMessage('La description doit contenir au moins 50 caractères'),
  body('category').isIn(['health', 'disability', 'children', 'education', 'renovation', 'emergency']).withMessage('Catégorie invalide'),
  body('cha9a9a_link').isURL().withMessage('Le lien Cha9a9a doit être une URL valide'),
  body('target_amount').isInt({ min: 1 }).withMessage('Le montant objectif doit être un nombre positif'),
  body('is_urgent').optional().isBoolean().withMessage('is_urgent doit être un booléen')
];

// Public routes
router.get('/', getCases);
router.get('/:id', getCaseById);

// Protected routes
router.get('/my/cases', authenticate, authorize('association', 'admin'), getMyCases);
router.post('/', authenticate, authorize('association', 'admin'), upload.array('photos', 5), createCaseValidation, validate, createCase);
router.put('/:id', authenticate, authorize('association', 'admin'), updateCase);
router.delete('/:id', authenticate, authorize('association', 'admin'), deleteCase);

export default router;
