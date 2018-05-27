// server.js

const axios = require('axios')
var express = require('express');
var app = express();

if (!process.env.PROJECT_DOMAIN) {
  // read environment variables (only necessary locally, not on Glitch)
  require('dotenv').config();
}

async function gifRequest(endpoint, params) {
  let result = await axios.get(
    'https://api.giphy.com/v1/gifs/' + endpoint, {
    params: {
      ...(params || {}),
      api_key: process.env.GIPHY_API_KEY
    }
  })
  return result.data.data
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/random', async (req, res, next) => {
  try {
    let result = []
    for (let i=0; i < 7; i++) {
      result.push(await gifRequest('random'))
    }
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

app.get('/trending', async (req, res, next) => {
  try {
    res.status(200).json(await gifRequest('trending'))
  } catch (err) {
    next(err)
  }
})

app.get('/search', async (req, res, next) => {
  try {
    let result = await gifRequest('search', {q: req.query.q})
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT || 8000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
