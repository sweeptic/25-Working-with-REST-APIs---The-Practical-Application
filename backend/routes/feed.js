import { Router } from 'express';

import { createPost, getPosts } from '../controllers/feed.js';

const feedRoutes = Router();

// GET /feed/posts
feedRoutes.get('/posts', getPosts);

// POST /feed/post
feedRoutes.post('/post', createPost);

export default feedRoutes;
