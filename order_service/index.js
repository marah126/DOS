const express = require('express');
const app = express();
const port = 3003;


app.get('/', (req, res) => {
  res.send('Hello from order !');
});

app.listen(port, () => {
  console.log(`order server is runing at ${port}`);
});