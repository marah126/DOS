const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

app.use('/bazar/search', (req, res) => {
  const urlPath = req.url;
  console.log("search api from front end service");
  console.log("urlPath", urlPath);

  const catalogPath = '/catalog/search'; // Update to match catalog service route

  const catalogUrl = `http://catalog:3002${catalogPath}`;

  // Forward the request to the catalog service
  axios.get(catalogUrl)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error(`Error forwarding request to ${catalogUrl}:`, error);
      console.log(error)
      res.status(500).send(`Error forwarding request to ${catalogUrl}`);
    });
});

app.listen(port, () => {
  console.log(`Frontend server is running at ${port}`);
});
