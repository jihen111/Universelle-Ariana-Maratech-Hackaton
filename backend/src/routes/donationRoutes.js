import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  getDonationsByCase,
  getMyDonations,
  createDonation
} from '../controllers/donationController.js';

const router = express.Router();

// Validation rules
const createDonationValidation = [
  body('case_id').isInt({ min: 1 }).withMessage('ID du cas invalide'),
  body('amount').isInt({ min: 1 }).withMessage('Le montant doit être un nombre positif'),
  body('message').optional().trim(),
  body('is_anonymous').optional().isBoolean().withMessage('is_anonymous doit être un booléen')
];

// Routes
router.get('/case/:caseId', getDonationsByCase);
router.get('/my', authenticate, getMyDonations);
router.post('/', authenticate, createDonationValidation, validate, createDonation);

export default router;
