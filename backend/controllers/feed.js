import { validationResult } from 'express-validator';

import Post from '../models/post.js';

export function getPosts(req, res, next) {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'Max',
        },
        date: new Date(),
      },
    ],
  });
}

export function createPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed.', errors: errors.array() });
  }

  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title,
    content,
    imageUrl: 'images/duck.jpg',
    creator: {
      name: 'Max',
    },
  });

  post
    .save()
    .then((result) => {
      console.log(result);

      res.status(201).json({
        message: 'Post created successfully',
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
