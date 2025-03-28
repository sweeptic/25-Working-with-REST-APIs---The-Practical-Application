import express from 'express';

import bodyParser from 'body-parser';

import feedRoutes from './routes/feed.js';

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// GET /feed/posts
app.use('/feed', feedRoutes);

app.listen(8080);
