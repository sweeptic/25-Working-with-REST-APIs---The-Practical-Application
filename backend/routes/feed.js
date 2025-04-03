import { Router } from 'express';

import { body } from 'express-validator';

import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/feed.js';
import isAuthMD from '../middleware/is-auth.js';

const feedRoutes = Router();

// GET /feed/posts
feedRoutes.get('/posts', isAuthMD, getPosts);

// POST /feed/post
feedRoutes.post(
  '/post',
  isAuthMD,
  [(body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 }))],
  createPost
);

feedRoutes.get('/post/:postId', isAuthMD, getPost);

feedRoutes.put(
  '/post/:postId',
  isAuthMD,
  [(body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 }))],
  updatePost
);

feedRoutes.delete('/post/:postId', isAuthMD, deletePost);

export default feedRoutes;
