import { Router } from 'express';

import { body } from 'express-validator';

import { login, signup } from '../controllers/auth.js';
import User from '../models/user.js';

const authRoutes = Router();

// GET /user/posts
authRoutes.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject('Email Address already exists!');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  signup
);

authRoutes.post('/login', login);

export default authRoutes;
