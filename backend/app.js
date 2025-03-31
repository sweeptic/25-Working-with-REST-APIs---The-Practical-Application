import express from 'express';

import bodyParser from 'body-parser';

import mongoose from 'mongoose';

import { fileURLToPath } from 'url';

import path, { dirname } from 'path';

import feedRoutes from './routes/feed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// GET /feed/posts
app.use('/feed', feedRoutes);

// general error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  res.status(status).json({ message });
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
