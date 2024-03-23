const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const { resolve } = require('path');
const app = express();
const port = 3002;

function searchBooks(topic) {
  return new Promise((resolve, reject) => {
    const books = [];
    fs.createReadStream('book.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.Topic === topic) {
          console.log("found book");
          books.push({ id: row.ID, title: row.Title });
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(books); // Resolve with the result
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error); // Reject in case of an error
      });
  });
}
function BookInfo(ID) {
  return new Promise((resolve, reject) => {
    const books = [];
    fs.createReadStream('book.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.ID == ID) {
          console.log("found book");
          books.push({ Id: row.ID, Title: row.Title, Quantity: row.Quantity, Price: row.Price, Topic: row.Topic });
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(books); // Resolve with the result
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error); // Reject in case of an error
      });
  })
}
app.get('/', (req, res) => {
  res.send('Hello from catalog!');
});

app.get('/catalog/search/:type', async (req, res) => {
  const type = req.params.type;
  try {
    const foundbooks = await searchBooks(type);
    if (foundbooks.length == 0) {
      res.json({ message: 'No books found for the specified topic' });
    }
    else {
      res.json(foundbooks);
    }
    console.log(foundbooks);

  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).send('Error searching books');
  }
});

app.get('/catalog/info/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const foundbooks = await BookInfo(id);
    if (foundbooks.length == 0) {
      res.send(`No book for this ID ${id}`);
    }
    else {
      res.json(foundbooks);
    }
    console.log(foundbooks);

  }
  catch (error) {
    console.error('Error searching books:', error);
    res.status(500).send('Error searching books');
  }
});

app.listen(port, () => {
  console.log(`Catalog server is running at ${port}`);
});
