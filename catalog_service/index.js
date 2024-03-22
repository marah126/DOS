const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => {
  res.send('Hello from catalog!');
});

app.get('/catalog/search', (req, res) => {
  // Handle the search logic here
  res.send('This is the catalog search API endpoint');
});

app.listen(port, () => {
  console.log(`Catalog server is running at ${port}`);
});
