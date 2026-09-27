import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import upload from '../config/multer.js';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

// Validation rules
const createEventValidation = [
  body('title').trim().isLength({ min: 5, max: 255 }).withMessage('Le titre doit contenir entre 5 et 255 caractères'),
  body('description').trim().isLength({ min: 20 }).withMessage('La description doit contenir au moins 20 caractères'),
  body('event_date').isISO8601().withMessage('Date invalide'),
  body('location').trim().isLength({ min: 3, max: 255 }).withMessage('Le lieu doit contenir entre 3 et 255 caractères')
];

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', authenticate, authorize('association', 'admin'), upload.single('image'), createEventValidation, validate, createEvent);
router.put('/:id', authenticate, authorize('association', 'admin'), upload.single('image'), updateEvent);
router.delete('/:id', authenticate, authorize('association', 'admin'), deleteEvent);

export default router;
