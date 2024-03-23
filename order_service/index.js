
const express = require('express');
const app = express();
const port = 3003;


app.get('/', (req, res) => {
  res.send('Hello from order !');
});

app.post('/order/purchase', (req, res) => {
  // Assuming you're processing some data sent in the request body
  const requestData = req.body;

  // Process the purchase logic here
  // Example: Save the order to the database, generate an order ID, etc.

  // Assuming you're sending back some response data
  const responseData = {
    orderId: '123456',
    message: 'Purchase successful!'
  };

  // Send back the response
  res.send(responseData);
});

app.listen(port, () => {
  console.log(`order server is runing at ${port}`);
});