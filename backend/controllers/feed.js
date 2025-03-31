import { validationResult } from 'express-validator';

import Post from '../models/post.js';

export function getPosts(req, res, next) {
  Post.find()
    .then((posts) => {
      res.status(200).json({ message: 'Fetched posts successfully', posts: posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });

  //   res.status(200).json({
  //     posts: [
  //       {
  //         _id: '1',
  //         title: 'First Post',
  //         content: 'This is the first post!',
  //         imageUrl: 'images/duck.jpg',
  //         creator: {
  //           name: 'Max',
  //         },
  //         date: new Date(),
  //       },
  //     ],
  //   });
}

export function createPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;

    // quit function execution and try to find the next error handling function or middleware.
    throw error;

    // return res.status(422).json({ message: 'Validation failed.', errors: errors.array() });
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
      //   console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      // this will not reach the next error handling middleware
      // because we are in a promise chain
      // throw err;

      //  stackoverflow.com/questions/30715367/why-can-i-not-throw-inside-a-promise-catch-handler

      next(err);
    });
}

export function getPost(req, res, next) {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(() => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
}
