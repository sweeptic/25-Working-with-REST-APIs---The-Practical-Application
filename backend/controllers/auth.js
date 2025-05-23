import { validationResult } from 'express-validator';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export function signup(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email,
        password: hashedPw,
        name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: 'User Created!', userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
}

export function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password.');
        error.statusCode = 401;
        throw error;
      }

      //create JWT
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        'some-super-secret-string',
        {
          expiresIn: '1h',
        }
      );

      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
}
