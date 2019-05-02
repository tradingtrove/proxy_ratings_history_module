require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
// const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const redis = require('redis');


const client = redis.createClient();
const app = express();
const port = process.env.PORT || 3000;

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './public')));


app.get('/stocks/:stockID', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/' + 'index.html');
});

// Loaderio for Stress Test
app.get('/loaderio-e6a2d072ae942af43b111087798b5b29', (req, res) => {
  res.send('loaderio-e6a2d072ae942af43b111087798b5b29');
});

// GET Stocks Ratings from Redis, if not, from request from server and place in cache in Redis
app.get('/api/stocks/:stockID/ratings', (req, res) => {
  client.get(req.params.stockID, (err, ratings) => {
    if (err) {
      throw err;
    }
    if (ratings) {
      res.status(200).json(JSON.parse(ratings));
    } else {
      axios.get(`http://3.215.38.175:3001/api/stocks/${req.params.stockID}/ratings`)
      .then(function (response) {
        res.send(response.data);
        client.set(req.params.stockID, JSON.stringify(response.data));
      })
      .catch(err => console.log('PROXY GET ERROR: ', err));
    }
});

// GET Purchase History from Redis, if not, from request from server and place in cache in Redis
app.get('/api/stocks/:stockID/history', (req, res) => {
  client.get(`${req.params.stockID}_purchase`, (err, ratings) => {
    if (err) {
      throw err;
    }
    if (ratings) {
      res.status(200).json(JSON.parse(ratings));
    } else {
      axios.get(`http://3.215.38.175:3001/api/stocks/${req.params.stockID}/history`)
      .then(function (response) {
        res.send(response.data);
        client.set(`${req.params.stockID}_purchase`, JSON.stringify(response.data));
      })
      .catch(err => console.log('PROXY GET ERROR: ', err));
    }
});

app.listen(port, () => {
  console.log(`server running at PORT: ${port}`);
});


// LOCALHOST, no Redis

// app.get('/api/stocks/:stockID/ratings', (req, res) => {
//   axios.get(`http://localhost:3001/api/stocks/${req.params.stockID}/ratings`)
//   .then(function (response) {
//     res.send(response.data);
//   })
//   .catch(err => console.log('PROXY GET ERROR: ', err));
// });

// app.get('/api/stocks/:stockID/history', (req, res) => {
//   axios.get(`http://localhost:3001/api/stocks/${req.params.stockID}/history`)
//   .then(function (response) {
//     res.send(response.data);
//   })
//   .catch(err => console.log('PROXY GET ERROR: ', err));
// });

// app.listen(port, () => {
//   console.log(`server running at: http://localhost:${port}`);
// });
