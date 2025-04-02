import { Router } from 'express';

import { PutSignup } from '../controllers/auth.js';

const userRoutes = Router();

// GET /user/posts
userRoutes.put('/signup', PutSignup);

export default userRoutes;
