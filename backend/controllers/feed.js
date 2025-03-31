import { validationResult } from 'express-validator';

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

  res.status(201).json({
    message: 'Post created successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: 'Max',
      },
      createdAt: new Date(),
    },
  });
}
