import { validationResult } from 'express-validator';

import path, { dirname } from 'path';

import { fileURLToPath } from 'url';

import fs from 'fs';

import Post from '../models/post.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title,
    content,
    imageUrl: imageUrl,
    creator: {
      name: 'Max',
    },
  });

  post
    .save()
    .then((result) => {
      console.log('Post created successfully');

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

export function updatePost(req, res, next) {
  console.log('UPDATEPOST');

  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
