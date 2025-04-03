import express from 'express';

import bodyParser from 'body-parser';

import mongoose from 'mongoose';

import { fileURLToPath } from 'url';

import path, { dirname } from 'path';

import multer from 'multer';

import authRoutes from './routes/auth.js';
import feedRoutes from './routes/feed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// GET /feed/posts
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// general error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;

  const data = error.data;

  res.status(status).json({ message, data });
});

const env = {
  mongodb_username: 'sweepticmac',
  mongodb_password: 'FvdCuyPuZSrXhAh5',
  mongodb_clustername: 'cluster0',
  mongodb_database: 'restApi-demo',
};

const connectionString = `mongodb+srv://${env.mongodb_username}:${env.mongodb_password}@${env.mongodb_clustername}.5mx6g.mongodb.net/${env.mongodb_database}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(connectionString)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
