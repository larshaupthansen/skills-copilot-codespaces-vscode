// Create Web server application which is responsible for comments.
// The application is able to store comments and retrieve them.
// The application should be able to store comments in a file.
// The application should be able to store comments in a database.
// The application should be able to store comments in a cache.
// The application should be able to store comments in a cloud storage.
// The application should be able to retrieve comments from a file.
// The application should be able to retrieve comments from a database.
// The application should be able to retrieve comments from a cache.
// The application should be able to retrieve comments from a cloud storage.
// The application should be able to retrieve comments from a remote server.
// The application should be able to retrieve comments from a remote server using a protocol different from HTTP.
// The application should be able to retrieve comments from a remote server using a protocol different from HTTP and a different data format than JSON.

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const redis = require('redis');
const redisClient = redis.createClient();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const request = require('request');
const app = express();

app.use(bodyParser.json());

// File storage
app.get('/file/comments', (req, res) => {
  fs.readFile('./comments.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/file/comments', (req, res) => {
  fs.readFile('./comments.json', 'utf8', (err, data) => {
    if (err) throw err;

    const comments = JSON.parse(data);
    comments.push(req.body);

    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
      if (err) throw err;
      res.json(comments);
    });
  });
});

// Database storage
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'comments'
});

connection.connect();

app.get('/database/comments', (req, res) => {
  connection.query('SELECT * FROM comments', (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.post('/database/comments', (req,