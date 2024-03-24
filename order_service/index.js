
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3003;

const fs = require('fs');
const csvFileName = 'orders.csv';

function writeToCSV(data, fileName) {

  const csvData = `${data.book_id},${data.book_name},${data.timestamp}\n`;

  fs.appendFileSync(fileName, csvData);
}

const dataToAppend = [
  { book_id: '3', book_name: 'Book 3', timestamp: '2024-04-01 12:00:00' },
  { book_id: '4', book_name: 'Book 4', timestamp: '2024-04-02 10:15:00' }
];


app.get('/', (req, res) => {
  res.send('Hello from order !');
});

app.post('/order/purchase/:id', (req, res) => {
  const id = req.params.id;
  console.log("from purchase in order with id : "+id);

  axios.get(`http://catalog:3002/catalog/item/${id}`)
    .then(response => {
      // const { title, id, quantity } = response.data;
      const result = response.data;
      console.log(response.data);
      if(result.length!=0){
      if (result[0].quantity > 0) {
        console.log("hi ");
        const now = new Date();
        const nowTimestamp = now.toISOString(); // Convert to ISO 8601 format

        console.log(nowTimestamp);

        const newOrder = { book_id: result[0].id, book_name: result[0].title, timestamp: nowTimestamp };
        writeToCSV(newOrder, csvFileName);

        axios.get(`http://catalog:3002/catalog/reduce/${id}`)
          .then(reduceResponse => {
            res.send(`Purchase successful for item number ${id}`);
          })
          .catch(reduceError => {
            console.error(`Error reducing quantity in catalog service:`, reduceError);
            res.status(500).send(`Error reducing quantity in catalog service`);
          });
      } else {
        console.log("not hi");
        res.status(400).send('Purchase failed: Item is out of stock');
      }
    }else{
      res.send(`No books for this ID ${id}`);
    }
    })
    .catch(error => {
      console.error('Error purchasing item:', error);
      res.status(400).send('Purchase failed: Item not available');
    });
});


app.listen(port, () => {
  console.log(`order server is runing at ${port}`);
});