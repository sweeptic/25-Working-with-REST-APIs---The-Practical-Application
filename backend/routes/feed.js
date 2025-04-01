import { Router } from 'express';

import { body } from 'express-validator';

import { createPost, getPost, getPosts, updatePost } from '../controllers/feed.js';

const feedRoutes = Router();

// GET /feed/posts
feedRoutes.get('/posts', getPosts);

// POST /feed/post
feedRoutes.post(
  '/post',
  [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })],
  createPost
);

feedRoutes.get('/post/:postId', getPost);

feedRoutes.put(
  '/post/:postId',
  [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })],
  updatePost
);

export default feedRoutes;
