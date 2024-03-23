
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

app.use('/bazar/search/:type', (req, res) => {
  const type=req.params.type;
  console.log("search api from front end service");

  const catalogPath = `/catalog/search/${type}`; // Update to match catalog service route

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

app.use('/bazar/info/:id', (req, res) => {
  const id = req.params.id;
  const urlPath = `/catalog/info/${id}`;
  const catalogUrl = `http://catalog:3002${urlPath}`;

  axios.get(catalogUrl)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error(`Error forwarding request to ${catalogUrl}:`, error);
      res.status(500).send(`Error forwarding request to ${catalogUrl}`);
    });
});

app.use('/bazar/purchase', (req, res) => {
  const urlPath = req.url;
  const orderPath = '/order';

  const orderUrl = `http://order:3003${urlPath}`;

  // Forward the request to the order service
  axios.post(orderUrl, req.body)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error(`Error forwarding request to ${orderUrl}:`, error);
      res.status(500).send(`Error forwarding request to ${orderUrl}`);
    });
});



app.listen(port, () => {
  console.log(`Frontend server is running at ${port}`);
});
