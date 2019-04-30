require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
// const morgan = require('morgan');
const path = require('path');
const axios = require('axios');

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

app.get('/api/stocks/:stockID/ratings', (req, res) => {
  axios.get(`http://localhost:3001/api/stocks/${req.params.stockID}/ratings`)
  .then(function (response) {
    res.send(response.data);
  })
  .catch(err => console.log('PROXY GET ERROR: ', err));
});

app.get('/api/stocks/:stockID/history', (req, res) => {
  axios.get(`http://localhost:3001/api/stocks/${req.params.stockID}/history`)
  .then(function (response) {
    res.send(response.data);
  })
  .catch(err => console.log('PROXY GET ERROR: ', err));
});


app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
